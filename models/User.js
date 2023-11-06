const mongoose = require("mongoose");

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String
    }
  },
  role: {
    type: String,
    default: 'student'
  }
}, { timestamps: true });

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;