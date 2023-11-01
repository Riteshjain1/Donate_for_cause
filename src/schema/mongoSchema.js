import "dotenv/config";
import { mongoose } from "../../app.js";

const userSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  email: String,
  password: String,
});

const ngoSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: Number,
  description: String,
  adress1: String,
  adress2: String,
  country: String,
  state: String,
  zip: Number,
  status: Number,
});

const transSchema = new mongoose.Schema({
  username: String,
  ngoname: String,
  amount: Number,
  date: String,
  status: String,
  message: String,
});

export const User = mongoose.model("User", userSchema);
export const Ngo = mongoose.model("Ngo", ngoSchema);
export const Trans = mongoose.model("trans", transSchema);
