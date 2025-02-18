import Contact from "../models/contact.js";

export const getAllContacts = async ({ userId, page, perPage, sortBy, sortOrder }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = { userId }; // Фільтрація за userId

  const [total, data] = await Promise.all([
    Contact.countDocuments(contactQuery),
    Contact.find(contactQuery) // Додаємо фільтр userId
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

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId }); // Заміна findById на findOne з userId
};

export const createContact = async (contact) => {
  return Contact.create(contact);
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId }); // Заміна findByIdAndDelete на findOneAndDelete
};

export const updateContact = async (contactId, userId, contact) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, contact, { new: true }); // Заміна findByIdAndUpdate на findOneAndUpdate
};
