const { ObjectId } = require('mongoose').Types;
const { Student, Course } = require('../models');

// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfStudents = await Student.countDocuments();
  return numberOfStudents;
}

// Aggregate function for getting the overall grade using $avg
const calculateOverallGrade = async (userId) => {
  const result = await Student.aggregate([
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
  // Get all students
  async getStudents(req, res) {
    try {
      const students = await Student.find();

      const studentsObj = {
        students,
        headCount: await headCount(),
      };

      res.json(studentsObj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Get a single student
  async getSingleStudent(req, res) {
    try {
      const student = await Student.findOne({ _id: req.params.studentId }).select('-__v');

      if (!student) {
        return res.status(404).json({ message: 'No student with that ID' });
      }

      const grade = await calculateOverallGrade(req.params.studentId);

      res.json({
        student,
        grade,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new student
  async createStudent(req, res) {
    try {
      const student = await Student.create(req.body);
      res.status(201).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Delete a student and remove them from the course
  async deleteStudent(req, res) {
    try {
      const student = await Student.findOneAndRemove({ _id: req.params.studentId });

      if (!student) {
        return res.status(404).json({ message: 'No such student exists' });
      }

      const course = await Course.findOneAndUpdate(
        { students: req.params.studentId },
        { $pull: { students: req.params.studentId } },
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
  // Add an assignment to a student
  async addAssignment(req, res) {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'No student found with that ID' });
      }

      res.json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Remove assignment from a student
  async removeAssignment(req, res) {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignments: { _id: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!student) {
        return res.status(404).json({ message: 'No student found with that ID' });
      }

      res.json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
