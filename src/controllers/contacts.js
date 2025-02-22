import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

// Функція для отримання всіх контактів
export async function getContactsControllers(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const userId = req.user._id; // Отримуємо userId з токену або сесії

    try {
        const result = await getAllContacts({ userId, page, perPage, sortBy, sortOrder });

        res.status(200).json({
            status: 200,
            message: "Contacts retrieved successfully!",
            data: result.data,
            pagination: {
                page: result.page,
                perPage: result.perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage
            }
        });
    } catch (error) {
        throw new createHttpError(500, "Error fetching contacts");
    }
}

// Функція для отримання одного контакту за ID
export async function getContactsIdControllers(req, res) {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
        throw new createHttpError(404, 'Contact not found or unauthorized access');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
}

// Функція для створення контакту
export async function createContactController(req, res) {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    const photo = req.file ? req.file.path : ""; // Якщо є файл, отримуємо шлях

    const contact = {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        userId,
        photo, // Додаємо фото у базу
    };

    try {
        const result = await createContact(contact);
        res.status(201).send({
            status: 201,
            message: "Successfully created a contact!",
            data: result
        });
    } catch (error) {
        throw new createHttpError(500, "Error creating contact");
    }
}

// Функція для видалення контакту
export async function deleteContactController(req, res) {
    const { contactId } = req.params;
    const userId = req.user._id;

    const result = await deleteContact(contactId, userId);

    if (!result) {
        throw new createHttpError(404, 'Contact not found or unauthorized access');
    }

    res.status(204).send({
        status: 204,
        message: "Contact deleted successfully!",
    });
}

// Функція для оновлення контакту
export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const userId = req.user._id;

    const existingContact = await getContactById(contactId, userId);

    if (!existingContact) {
        throw new createHttpError(404, 'Contact not found or unauthorized access');
    }

    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file ? req.file.path : existingContact.photo; // Оновлюємо фото тільки якщо воно передане

    const updatedContact = {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        photo, // Оновлене або старе фото
    };

    try {
        const result = await updateContact(contactId, userId, updatedContact);
        res.status(200).send({
            status: 200,
            message: "Successfully updated the contact!",
            data: result
        });
    } catch (error) {
        throw new createHttpError(500, "Error updating contact");
    }
}
