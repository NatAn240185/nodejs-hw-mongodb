import mongoose from "mongoose";
import Joi from "joi"; // Додаємо Joi для валідації

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    photo: { type: String, default: "" } // Додаємо поле для фото
}, { versionKey: false, timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

// Схема Joi для створення контакту
export const contactSchemaJoi = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    photo: Joi.string().optional(),
});

// Схема Joi для оновлення контакту
export const replaceContactSchemaJoi = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    phone: Joi.string().min(10).max(20),
    photo: Joi.string().optional(),
});

export default Contact;
