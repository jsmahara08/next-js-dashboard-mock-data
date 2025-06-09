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

async function handleRequest(req, res, method, id, query, user) {
  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single category with subcategories
          const category = await Category.findById(id).populate('parentId', 'name slug');
          if (!category) {
            return sendResponse(res, 404, { error: 'Category not found' });
          }
          
          // Get subcategories
          const subcategories = await Category.find({ parentId: id }).select('_id name slug description status');
          
          sendResponse(res, 200, {
            ...category.toObject(),
            subcategories
          });
        } else {
          // Get all categories with hierarchy
          const categories = await Category.find()
            .populate('parentId', 'name slug')
            .sort({ createdAt: -1 });
          
          // Organize into hierarchy
          const mainCategories = categories.filter(cat => !cat.parentId);
          const subcategories = categories.filter(cat => cat.parentId);
          
          const categoriesWithSubs = mainCategories.map(cat => ({
            ...cat.toObject(),
            subcategories: subcategories.filter(sub => 
              sub.parentId && sub.parentId._id.toString() === cat._id.toString()
            )
          }));
          
          sendResponse(res, 200, categoriesWithSubs);
        }
        break;

      case 'POST':
        // Check authentication for write operations
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        const categoryData = await parseBody(req);
        
        // Validate required fields
        if (!categoryData.name) {
          return sendResponse(res, 400, { error: 'Category name is required' });
        }
        
        // Generate slug if not provided
        if (!categoryData.slug) {
          categoryData.slug = categoryData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        
        // Check if slug already exists
        const existingCategory = await Category.findOne({ slug: categoryData.slug });
        if (existingCategory) {
          return sendResponse(res, 400, { error: 'Category slug already exists' });
        }
        
        const newCategory = new Category(categoryData);
        await newCategory.save();
        await newCategory.populate('parentId', 'name slug');
        
        sendResponse(res, 201, newCategory);
        break;

      case 'PUT':
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'Category ID required' });
        }
        
        const updateData = await parseBody(req);
        
        // Check if category exists
        const existingCat = await Category.findById(id);
        if (!existingCat) {
          return sendResponse(res, 404, { error: 'Category not found' });
        }
        
        // If slug is being updated, check for conflicts
        if (updateData.slug && updateData.slug !== existingCat.slug) {
          const slugConflict = await Category.findOne({ 
            slug: updateData.slug, 
            _id: { $ne: id } 
          });
          if (slugConflict) {
            return sendResponse(res, 400, { error: 'Category slug already exists' });
          }
        }
        
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true })
          .populate('parentId', 'name slug');
        
        sendResponse(res, 200, updatedCategory);
        break;

      case 'DELETE':
        if (!user || user.role !== 'admin') {
          return sendResponse(res, 403, { error: 'Admin access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'Category ID required' });
        }
        
        // Check if category has subcategories
        const hasSubcategories = await Category.findOne({ parentId: id });
        if (hasSubcategories) {
          return sendResponse(res, 400, { error: 'Cannot delete category with subcategories' });
        }
        
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
          return sendResponse(res, 404, { error: 'Category not found' });
        }
        
        sendResponse(res, 200, { success: true, message: 'Category deleted successfully' });
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