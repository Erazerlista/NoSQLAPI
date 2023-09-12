const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'Please enter a username...',
      trim: true,
    },
    email: {
      type: String,
      required: 'Please enter an email...',
      unique: true,
      validate: {
        validator: (value) => {
          // Use a library or a more robust email validation regex
          const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
