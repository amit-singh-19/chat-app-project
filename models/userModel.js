const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // minlength: 3, maxLength: 30
    },
    email: {
      type: String,
      required: true,
      // minlength: 3,
      // maxLength: 200,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: { type: String, required: true, minlength: 3, maxLength: 1024 },
    is_online: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
