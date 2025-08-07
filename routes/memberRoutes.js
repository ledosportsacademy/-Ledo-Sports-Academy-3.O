const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// GET search members by name
router.get('/search', memberController.searchMembers);

// GET all members
router.get('/', memberController.getAllMembers);

// GET a single member by ID
router.get('/:id', memberController.getMemberById);

// POST a new member
router.post('/', memberController.createMember);

// PUT (update) a member
router.put('/:id', memberController.updateMember);

// DELETE a member
router.delete('/:id', memberController.deleteMember);

module.exports = router;