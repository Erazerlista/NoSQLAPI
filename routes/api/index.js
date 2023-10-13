const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

// Use the routes without specifying '/thoughtRoutes' or '/userRoutes' as the base path.
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;
