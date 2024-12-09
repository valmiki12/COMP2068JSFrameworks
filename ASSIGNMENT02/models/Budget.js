const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  savings: {
    type: Number,
    default: 0, // Default planned savings to 0
  },
  limit: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Budget', BudgetSchema);
