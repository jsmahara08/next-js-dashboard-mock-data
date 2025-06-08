const CMSPage = require('../models/CMSPage');

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
          // Get single CMS page
          const page = await CMSPage.findById(id);
          if (!page) {
            return sendResponse(res, 404, { error: 'CMS page not found' });
          }
          sendResponse(res, 200, page);
        } else {
          // Get all CMS pages
          const pages = await CMSPage.find().sort({ createdAt: -1 });
          sendResponse(res, 200, pages);
        }
        break;

      case 'POST':
        // Create new CMS page
        const pageData = await parseBody(req);
        const newPage = new CMSPage(pageData);
        await newPage.save();
        sendResponse(res, 201, newPage);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'CMS page ID required' });
        }
        // Update CMS page
        const updateData = await parseBody(req);
        const updatedPage = await CMSPage.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPage) {
          return sendResponse(res, 404, { error: 'CMS page not found' });
        }
        sendResponse(res, 200, updatedPage);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'CMS page ID required' });
        }
        // Delete CMS page
        const deletedPage = await CMSPage.findByIdAndDelete(id);
        if (!deletedPage) {
          return sendResponse(res, 404, { error: 'CMS page not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('CMS controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };