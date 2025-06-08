const SiteSettings = require('../models/SiteSettings');

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
        // Get site settings (there should only be one)
        const settings = await SiteSettings.findOne();
        if (!settings) {
          return sendResponse(res, 404, { error: 'Site settings not found' });
        }
        sendResponse(res, 200, settings);
        break;

      case 'POST':
        // Create new site settings
        const settingsData = await parseBody(req);
        const newSettings = new SiteSettings(settingsData);
        await newSettings.save();
        sendResponse(res, 201, newSettings);
        break;

      case 'PUT':
        // Update site settings
        const updateData = await parseBody(req);
        let updatedSettings = await SiteSettings.findOne();
        if (!updatedSettings) {
          // Create if doesn't exist
          updatedSettings = new SiteSettings(updateData);
          await updatedSettings.save();
        } else {
          // Update existing
          Object.assign(updatedSettings, updateData);
          await updatedSettings.save();
        }
        sendResponse(res, 200, updatedSettings);
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Settings controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };