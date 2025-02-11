import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/, // Перевірка на email
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Мінімальна довжина пароля
    },
  },
  {
    versionKey: false,
    timestamps: true, // автоматично додає createdAt та updatedAt
  }
);

// Видаляємо пароль перед відправкою об'єкта
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
