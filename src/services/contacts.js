import Contact from "../models/contact.js";

// Отримати всі контакти
export async function getAllContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error("Database error while fetching contacts");
  }
}

// Видалити контакт за ID
export async function deleteContact(contactId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact; // null, якщо контакту немає
  } catch (error) {
    throw new Error("Database error during deletion");
  }
}

