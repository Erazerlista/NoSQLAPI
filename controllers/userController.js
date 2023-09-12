const { ObjectId } = require('mongoose').Types;
const { User, Course } = require('../models');

// Aggregate function to get the number of users overall
const headCount = async () => {
  const numberOfUsers = await User.countDocuments();
  return numberOfUsers;
}

// Aggregate function for getting the overall grade using $avg
const calculateOverallGrade = async (userId) => {
  const result = await User.aggregate([
    { $match: { _id: new ObjectId(userId) } },
    { $unwind: '$assignments' },
    {
      $group: {
        _id: new ObjectId(userId),
        overallGrade: { $avg: '$assignments.score' },
      },
    },
  ]);

  return result.length > 0 ? result[0] : null;
};

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const usersObj = {
        users,
        headCount: await headCount(),
      };

      res.json(usersObj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      const grade = await calculateOverallGrade(req.params.userId);

      res.json({
        user,
        grade,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Delete a user and remove them from the course
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      const course = await Course.findOneAndUpdate(
        { users: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({
          message: 'User deleted, but no course found',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Add an assignment to a user
  async addAssignment(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Remove assignment from a user
  async removeAssignment(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { assignments: { _id: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
