const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}`;
    }
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for formatted creation date
userSchema.virtual('createdAt').get(function() {
  return this._id.getTimestamp();
});

module.exports = mongoose.model('User', userSchema);