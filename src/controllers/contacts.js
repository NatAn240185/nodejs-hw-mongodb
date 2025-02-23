import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { createContactSchema } from '../validation/contactValidation.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = { ...parseFilterParams(req.query), userId };

    const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    });

        res.json({
        status: 200,
        message: `Successfully found contacts!`,
        data: contacts,
    });
    } catch (error) {
        next(error);
    }
};

export const getContactByIdController = async (req, res, next) => {
  try {const { contactId } = req.params;
  const { _id: userId } = req.user;
    const contact = await getContactById( contactId, userId );

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
  } catch (error) {next(error);    
  }
  };

export const createContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const validatedData = await createContactSchema.validateAsync(req.body, { abortEarly: false });
    const contact = await createContact( validatedData, userId );

    res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await deleteContact(contactId, userId );

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await updateContact( contactId, req.body, userId );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact
  });
};
