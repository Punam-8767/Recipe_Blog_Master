const { Schema, model } = require("mongoose");
// user schema defines the structure of the data that will be stored in the MongoDB database for a user document
const userSchema = new Schema({
  
  username: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, unique: true },
  password1: { type: String},
  token: { type: String },
});

module.exports = model("user", userSchema);
