const express = require('express')
const router = express.Router()
const phoneController =   require('../controllers/phones.controller');
// Get all phones
router.get('/', phoneController.findAll);
// Create a new phone
router.post('/', phoneController.create);
// // get a single phone with id
 router.get('/:id', phoneController.findById);
// // Update a phone with id
 router.put('/', phoneController.update);
// // Delete a phone with id
 router.delete('/:id', phoneController.delete);
module.exports = router