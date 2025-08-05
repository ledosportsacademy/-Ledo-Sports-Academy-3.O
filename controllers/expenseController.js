const Expense = require('../models/Expense');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, minAmount, maxAmount } = req.query;
    let query = {};
    
    // Apply date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Apply category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Apply amount range filter if provided
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { 
      title, 
      amount, 
      date, 
      category, 
      description, 
      paymentMethod,
      approvedBy,
      receiptImage,
      notes 
    } = req.body;
    
    const newExpense = new Expense({
      title,
      amount,
      date: date || Date.now(),
      category: category || 'Other',
      description,
      paymentMethod: paymentMethod || 'Cash',
      approvedBy,
      receiptImage,
      notes
    });
    
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { 
      title, 
      amount, 
      date, 
      category, 
      description, 
      paymentMethod,
      approvedBy,
      receiptImage,
      notes 
    } = req.body;
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        date,
        category,
        description,
        paymentMethod,
        approvedBy,
        receiptImage,
        notes,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const totalAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const expensesByMonth = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const expensesByCategory = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      expensesByMonth,
      expensesByCategory
    });
  } catch (error) {
    console.error('Error getting expense statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};