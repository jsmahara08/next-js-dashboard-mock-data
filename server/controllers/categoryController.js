const Category = require('../models/Category');

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
          // Get single category
          const category = await Category.findById(id).populate('parentId', 'name slug');
          if (!category) {
            return sendResponse(res, 404, { error: 'Category not found' });
          }
          sendResponse(res, 200, category);
        } else {
          // Get all categories
          const categories = await Category.find()
            .populate('parentId', 'name slug')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, categories);
        }
        break;

      case 'POST':
        // Create new category
        const categoryData = await parseBody(req);
        const newCategory = new Category(categoryData);
        await newCategory.save();
        await newCategory.populate('parentId', 'name slug');
        sendResponse(res, 201, newCategory);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'Category ID required' });
        }
        // Update category
        const updateData = await parseBody(req);
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true })
          .populate('parentId', 'name slug');
        if (!updatedCategory) {
          return sendResponse(res, 404, { error: 'Category not found' });
        }
        sendResponse(res, 200, updatedCategory);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'Category ID required' });
        }
        // Delete category
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
          return sendResponse(res, 404, { error: 'Category not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Category controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };