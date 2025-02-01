import Contact from "../models/contact";

export async function deleteContact(contactId) {
  try {
    // Використовуємо метод findByIdAndDelete для пошуку та видалення контакту
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    // Повертаємо результат (якщо контакт не знайдено, він буде null)
    return deletedContact;
  } catch (error) {
    throw new Error("Database error during deletion");
  }
}
