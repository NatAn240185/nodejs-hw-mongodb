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
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const patchContactController = async (req, res, next) => {
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
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};


const router = express.Router();
router.use(express.json());

export async function getContactsControllers(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      userId: req.user._id, 
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactsIdControllers(req, res, next) {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id); // 🔥 Оновлено

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContactController(req, res, next) {
  try {
    const contact = {
      ...req.body,
      userId: req.user._id,
    };

    const result = await createContact(contact);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContactController(req, res, next) {
  try {
    const contact = await deleteContact(req.params.contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).json({
      status: 204,
      message: 'Contact deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactController(req, res, next) {
  try {
    const updatedContact = await updateContact(
      req.params.contactId,
      req.user._id,
      req.body,
    ); // 🔥 Оновлено

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}
