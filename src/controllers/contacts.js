import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export async function getContactsControllers(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder });

    if (!contacts) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactsIdControllers(req, res) {
    const contact = await getContactById(req.params.contactId);

    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
    });
}

export async function createContactController(req, res) {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file ? req.file.path : ""; // Якщо є файл, отримуємо шлях

    const contact = {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        userId: req.user._id,
        photo, // Додаємо фото у базу
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
    
    const result = await deleteContact(contactId);

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(204).send({
        status: 204,
        message: "Contact deleted successfully!",
    });
}

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const existingContact = await getContactById(contactId);

    if (!existingContact || existingContact.userId.toString() !== req.user._id.toString()) {
        throw new createHttpError(404, 'Contact not found');
    }

    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file ? req.file.path : existingContact.photo; // Оновлюємо фото тільки якщо воно передане

    const contact = {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        photo, // Оновлене або старе фото
    };

    const result = await updateContact(contactId, contact);

    res.status(200).send({
        status: 200,
        message: "Successfully patched a contact!",
        data: result
    });
}
