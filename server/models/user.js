import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, default: "Anonymous" },
  email: { type: String, required: true, unique: true },
  resume: { type: String },
  image: { type: String, default: '' }
});

const User = mongoose.model('User', userSchema);

export default User;