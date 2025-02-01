import * as contactsService from "../services/contacts.js";
import createError from "http-errors"; // для обробки помилок

// Видалити контакт за ID
export async function deleteContact(req, res, next) {
  const { contactId } = req.params;

  try {
    // Викликаємо сервіс для видалення контакту
    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    // Якщо контакт було успішно видалено, повертаємо статус 204 (без тіла відповіді)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


