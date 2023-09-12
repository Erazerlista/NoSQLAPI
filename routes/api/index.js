const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

// Use the routes without specifying '/thoughtRoutes' or '/userRoutes' as the base path.
router.use(thoughtRoutes);
router.use(userRoutes);

module.exports = router;
