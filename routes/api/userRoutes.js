const router = require('express').Router();
const {
  getUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// Get all users and create a new user
router.route('/users')
  .get(getUser)
  .post(createUser);

// Get a single user by _id, update user by _id, and delete user by _id
router.route('/users/:_id')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

// Add a new friend to a user
router.route('/users/:_id/friends')
  .post(addFriend);

// Remove a friend from a user
router.route('/users/:_id/friends/:friendId')
  .delete(removeFriend);

module.exports = router;
