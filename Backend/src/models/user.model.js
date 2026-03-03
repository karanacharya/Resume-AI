const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username already taken"],
  },
  email: {
    type: String,
    required: [true, "Email is required to Create an Account"],
    unique: [true, "Email Already Exists"],
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("users" , userSchema);

module.exports = userModel;



