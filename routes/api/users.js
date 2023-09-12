const router = require('express').Router();
const {
  getUser,
  getSingleUser,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/studentController');

// /api/users
router.route('/').get(getUser).post(createUser);

// /api/students/:studentId
router.route('/:studentId').get(getSingleUser).delete(deleteUser);

// /api/add new friend
router.route('/:studentId/assignments').post(addFriend);

// /api/remove new friend
router.route('/:studentId/assignments/:assignmentId').delete(removeFriend);

module.exports = router;

//change route when control is updated!