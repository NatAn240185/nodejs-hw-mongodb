import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import express from 'express';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import * as fs from "node:fs/promises";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js.js";
import { getEnvVar } from '../utils/getEnvVar.js';

const router = express.Router();

router.use(express.json());

export async function getContactsControllers(req, res) {
  
  const {page, perPage} = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query); 

  const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, userId: req.user._id, });

  if (contacts === null) {
    throw new createHttpError(404, 'Contact not found');
    }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export async function getContactsIdControllers (req, res) {
  const contact = await getContactById(req.params.contactId);
  
    if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
    }
  
  if (contact.userId.toString() !== req.user._id.toString()) {
     throw new createHttpError(404, 'Contact not found');
   }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
};
export const createContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact`,
    data: result.student,
  });
};

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  
  const contact = await deleteContact(contactId);

  if (contact === null || contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError(404, 'Contact not found');
  }
  
  res.status(204).send({
  status: 204,
  message: "Contact deleted successfully!",
});
}

export async function updateContactController(req, res) {

    let photo;
  
  if (req.file) {
      const savePhotoCloudinary = await saveFileToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = savePhotoCloudinary.secure_url;
    }

  const { contactId } = req.params;

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    photo,
  };

  const existingContact = await updateContact(contactId, contact);

  if (existingContact === null || existingContact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError(404, 'Contact not found');
  }

    res.status(200).send({
    status: 200,
    message: "Successfully patched a contact!",
    data: existingContact
  });
  
}