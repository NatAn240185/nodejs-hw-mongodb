import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  isFavourite: Boolean,
  contactType: String
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

