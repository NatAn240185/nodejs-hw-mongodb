import { Contact } from "../models/contact.js";

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, userId }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find({ userId });

  const [total, data] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);
  
  return {
      data,
      page,
      perPage,
      totalItems: total,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: totalPages - page > 0
    };
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (contact) => {
  return Contact.create(contact);
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

export const updateContact = async (contactId, contact) => {
  return Contact.findByIdAndUpdate(contactId, contact, { new: true });
};