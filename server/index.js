const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Question = require('./models/Question');
const News = require('./models/News');
const MCQ = require('./models/MCQ');
const Category = require('./models/Category');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const CMSPage = require('./models/CMSPage');
const SiteSettings = require('./models/SiteSettings');

// Import controllers
const userController = require('./controllers/userController');
const questionController = require('./controllers/questionController');
const newsController = require('./controllers/newsController');
const mcqController = require('./controllers/mcqController');
const categoryController = require('./controllers/categoryController');
const courseController = require('./controllers/courseController');
const quizController = require('./controllers/quizController');
const cmsController = require('./controllers/cmsController');
const settingsController = require('./controllers/settingsController');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed initial data if needed
    seedInitialData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Helper function to send JSON response
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper function to handle CORS preflight
function handleCORS(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return true;
  }
  return false;
}

// Router function
async function router(req, res) {
  if (handleCORS(req, res)) return;

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  try {
    // Extract ID from path if present
    const pathParts = path.split('/').filter(part => part);
    const resource = pathParts[1]; // api/users -> users
    const id = pathParts[2]; // api/users/123 -> 123

    // Route to appropriate controller
    switch (resource) {
      case 'users':
        await userController.handleRequest(req, res, method, id, query);
        break;
      case 'questions':
        await questionController.handleRequest(req, res, method, id, query);
        break;
      case 'news':
        await newsController.handleRequest(req, res, method, id, query);
        break;
      case 'mcqs':
        await mcqController.handleRequest(req, res, method, id, query);
        break;
      case 'categories':
        await categoryController.handleRequest(req, res, method, id, query);
        break;
      case 'courses':
        await courseController.handleRequest(req, res, method, id, query);
        break;
      case 'quizzes':
        await quizController.handleRequest(req, res, method, id, query);
        break;
      case 'cms':
        await cmsController.handleRequest(req, res, method, id, query);
        break;
      case 'settings':
        await settingsController.handleRequest(req, res, method, id, query);
        break;
      default:
        sendResponse(res, 404, { error: 'Route not found' });
    }
  } catch (error) {
    console.error('Router error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

// Create HTTP server
const server = http.createServer(router);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Seed initial data
async function seedInitialData() {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User'
      });
      console.log('Admin user created');
    }

    // Check if site settings exist
    const settingsExist = await SiteSettings.findOne();
    if (!settingsExist) {
      await SiteSettings.create({
        siteName: 'Learning Platform',
        logo: '/logo.svg',
        favicon: '/favicon.ico',
        primaryColor: '#3B82F6',
        contactEmail: 'contact@example.com',
        socialLinks: {
          facebook: 'https://facebook.com/learningplatform',
          twitter: 'https://twitter.com/learningplatform',
          instagram: 'https://instagram.com/learningplatform',
          linkedin: 'https://linkedin.com/company/learningplatform'
        },
        footer: {
          copyright: '© 2023 Learning Platform. All rights reserved.',
          links: [
            { text: 'Terms', url: '/terms' },
            { text: 'Privacy', url: '/privacy' },
            { text: 'FAQ', url: '/faq' }
          ]
        }
      });
      console.log('Site settings created');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});