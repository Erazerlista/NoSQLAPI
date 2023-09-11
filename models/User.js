const { Schema, Types } = require('mongoose');

function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

const UserSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    username: {
      type: String,
      unique: true,
      required: 'Please enter username...',
      trim: true,
    },
    email: {
      type: String,
      required: 'Please enter email...',
      unique: true,
      validate: {
        validator: validateEmail, 
        message: 'Please fill in a valid email address',
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

// friendcount section
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

module.exports = UserSchema;
