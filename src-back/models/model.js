const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRegistrySchema = new mongoose.Schema({
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
  confirmpassword: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },

  gender: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// create a Collection
// generating tokens
userRegistrySchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas consequuntur aliquam, ea provident commodi nam sequi quasi totam quos veniam ullam doloremque eius nobis, ex unde modi laudantium laboriosam odit! Delectus, sapiente.'
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
  } catch (err) {
    console.log(err);
  }
};

// converting password

userRegistrySchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = new mongoose.model('UserRegistryInfo', userRegistrySchema);
module.exports = Register;
