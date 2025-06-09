const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
          
          // Simple password check (in production, use bcrypt)
          if (email === 'admin@example.com' && password === 'password') {
            const user = await User.findOne({ email });
            if (!user) {
              return sendResponse(res, 404, { error: 'User not found' });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = generateToken(user._id);
            
            sendResponse(res, 200, {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                avatar: user.avatar
              },
              token
            });
          } else {
            sendResponse(res, 401, { error: 'Invalid credentials' });
          }
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

            sendResponse(res, 200, {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                avatar: user.avatar
              }
            });
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