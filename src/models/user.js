import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
      unique: true, 
  },
  password: {
  type: String,
  required: true,
  },
}, {
  versionKey: false, 
  timestamps: true
});

User.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const userMon = mongoose.model("User", User);

export default userMon;