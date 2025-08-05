const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth } = require('../middleware/auth');

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Private
router.get('/', auth, expenseController.getAllExpenses);

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', auth, expenseController.getExpenseStats);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, expenseController.getExpenseById);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, expenseController.createExpense);

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, expenseController.updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;