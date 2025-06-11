const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
}

async function handleRequest(req, res, method, endpoint, query) {
  try {
    switch (endpoint) {
      case 'login':
        if (method === 'POST') {
          const { email, password } = await parseBody(req);
          
          if (!email || !password) {
            return sendResponse(res, 400, { error: 'Email and password are required' });
          }

          const user = await User.findOne({ email });
          if (!user) {
            return sendResponse(res, 401, { error: 'Invalid credentials' });
          }

          const isPasswordValid = await user.comparePassword(password);
          if (!isPasswordValid) {
            return sendResponse(res, 401, { error: 'Invalid credentials' });
          }

          if (user.status !== 'active') {
            return sendResponse(res, 401, { error: 'Account is not active' });
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          const token = generateToken(user._id);
          
          sendResponse(res, 200, {
            user: user.toJSON(),
            token
          });
        } else {
          sendResponse(res, 405, { error: 'Method not allowed' });
        }
        break;

      case 'register':
        if (method === 'POST') {
          const { name, email, password, confirmPassword } = await parseBody(req);
          
          if (!name || !email || !password) {
            return sendResponse(res, 400, { error: 'Name, email, and password are required' });
          }

          if (password !== confirmPassword) {
            return sendResponse(res, 400, { error: 'Passwords do not match' });
          }

          if (password.length < 6) {
            return sendResponse(res, 400, { error: 'Password must be at least 6 characters long' });
          }

          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return sendResponse(res, 400, { error: 'User with this email already exists' });
          }

          const newUser = new User({
            name,
            email,
            password,
            role: 'user' // Default role for registration
          });

          await newUser.save();

          const token = generateToken(newUser._id);
          
          sendResponse(res, 201, {
            user: newUser.toJSON(),
            token
          });
        } else {
          sendResponse(res, 405, { error: 'Method not allowed' });
        }
        break;

      case 'verify':
        if (method === 'GET') {
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return sendResponse(res, 401, { error: 'No token provided' });
          }

          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId);
            
            if (!user) {
              return sendResponse(res, 404, { error: 'User not found' });
            }

            if (user.status !== 'active') {
              return sendResponse(res, 401, { error: 'Account is not active' });
            }

            sendResponse(res, 200, {
              user: user.toJSON()
            });
          } catch (error) {
            sendResponse(res, 401, { error: 'Invalid token' });
          }
        } else {
          sendResponse(res, 405, { error: 'Method not allowed' });
        }
        break;

      case 'change-password':
        if (method === 'POST') {
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];

          if (!token) {
            return sendResponse(res, 401, { error: 'No token provided' });
          }

          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId);
            
            if (!user) {
              return sendResponse(res, 404, { error: 'User not found' });
            }

            const { currentPassword, newPassword, confirmPassword } = await parseBody(req);

            if (!currentPassword || !newPassword || !confirmPassword) {
              return sendResponse(res, 400, { error: 'All password fields are required' });
            }

            if (newPassword !== confirmPassword) {
              return sendResponse(res, 400, { error: 'New passwords do not match' });
            }

            if (newPassword.length < 6) {
              return sendResponse(res, 400, { error: 'New password must be at least 6 characters long' });
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
              return sendResponse(res, 400, { error: 'Current password is incorrect' });
            }

            user.password = newPassword;
            await user.save();

            sendResponse(res, 200, { message: 'Password changed successfully' });
          } catch (error) {
            sendResponse(res, 401, { error: 'Invalid token' });
          }
        } else {
          sendResponse(res, 405, { error: 'Method not allowed' });
        }
        break;

      default:
        sendResponse(res, 404, { error: 'Auth endpoint not found' });
    }
  } catch (error) {
    console.error('Auth controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };