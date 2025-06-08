const User = require('../models/User');

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

async function handleRequest(req, res, method, id, query) {
  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single user
          const user = await User.findById(id);
          if (!user) {
            return sendResponse(res, 404, { error: 'User not found' });
          }
          sendResponse(res, 200, user);
        } else {
          // Get all users
          const users = await User.find().sort({ createdAt: -1 });
          sendResponse(res, 200, users);
        }
        break;

      case 'POST':
        // Create new user
        const userData = await parseBody(req);
        const newUser = new User(userData);
        await newUser.save();
        sendResponse(res, 201, newUser);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'User ID required' });
        }
        // Update user
        const updateData = await parseBody(req);
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
          return sendResponse(res, 404, { error: 'User not found' });
        }
        sendResponse(res, 200, updatedUser);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'User ID required' });
        }
        // Delete user
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return sendResponse(res, 404, { error: 'User not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };