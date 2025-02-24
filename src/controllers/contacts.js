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
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

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

export async function createContactController(req, res) {

  let photo;
  
  if (req.file) {
      const savePhotoCloudinary = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = savePhotoCloudinary.secure_url;
    }

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
    photo,
  };

  const result = await createContact(contact);

  res.status(201).send({
    status: 201,
    message: "Successfully created a contact!",
    data: result
  });

}

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
      const savePhotoCloudinary = await uploadToCloudinary(req.file.path);
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