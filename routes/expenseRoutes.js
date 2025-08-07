const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// GET all expenses
router.get('/', expenseController.getAllExpenses);

// GET total expenses amount
router.get('/total', expenseController.getTotalExpenses);

// GET expenses by category
router.get('/by-category', expenseController.getExpensesByCategory);

// GET a single expense by ID
router.get('/:id', expenseController.getExpenseById);

// POST a new expense
router.post('/', expenseController.createExpense);

// PUT (update) an expense
router.put('/:id', expenseController.updateExpense);

// DELETE an expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;