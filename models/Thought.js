const { Schema, model } = require('mongoose');
const AssignmentSchema = require('./Assignment'); 
const studentSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280, 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
      get: (timestamp) => new Date(timestamp).toLocaleString(), 
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reaction', 
      },
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true, 
    },
  }
);

studentSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Student = model('Student', studentSchema); 

module.exports = Student; 