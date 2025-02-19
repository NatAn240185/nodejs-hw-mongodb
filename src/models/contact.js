import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    photo: { type: String, default: "" } // Додаємо поле для фото
}, { versionKey: false, timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
