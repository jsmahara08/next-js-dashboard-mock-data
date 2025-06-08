const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String
  },
  favicon: {
    type: String
  },
  primaryColor: {
    type: String,
    default: '#3B82F6'
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  footer: {
    copyright: {
      type: String,
      required: true
    },
    links: [{
      text: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);