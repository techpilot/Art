const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field cannot be left blank"]
  },
  email: {
    required: [true, "You must provide an email to continue"],
    unique: [true, "This email already exists"],
    type: String,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    required: [true, "Sorry, the password field cannot be blank"],
    type: String,
    minlength: [8, "Your password be more than seven characters"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Re-enter your password"],
    validate: {
      // This only works on CREATE $ SAVE
      validator: function (el) {
        return el === this.password
      },
      message: "Retype your exact password"
    }
  },
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)


userSchema.pre('save', async function (next) {
  // Run this func if password was modified
  if (!this.isModified('password')) return next();

  // Hash the Password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema)

module.exports = User;