const { Schema, Types } = require('mongoose');

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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
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
    },
    id: false,
  }
);

module.exports = UserSchema;
