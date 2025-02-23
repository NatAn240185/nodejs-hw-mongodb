import { ContactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {}, }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find({userId});

if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
}

const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find({userId}).merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId ) => {
  const contact = await ContactsCollection.findOne({_id: id, userId});
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await ContactsCollection.create({...payload, userId });
  return contact;
};

export const deleteContact = async (id, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({_id: id, userId});

  return contact;
};

export const updateContact = async (id, payload, userId, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate({ _id: id, userId},
    payload,
    { new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};