const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  timeLimit: {
    type: Number
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQ'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);