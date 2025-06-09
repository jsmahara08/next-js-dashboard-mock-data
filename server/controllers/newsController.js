const News = require('../models/News');

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
          // Get single news article
          const news = await News.findById(id)
            .populate('author', 'name email')
            .populate('categoryId', 'name slug')
            .populate('subcategoryId', 'name slug');
          if (!news) {
            return sendResponse(res, 404, { error: 'News article not found' });
          }
          sendResponse(res, 200, news);
        } else {
          // Get all news articles
          const news = await News.find()
            .populate('author', 'name email')
            .populate('categoryId', 'name slug')
            .populate('subcategoryId', 'name slug')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, news);
        }
        break;

      case 'POST':
        // Check authentication for write operations
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        const newsData = await parseBody(req);
        
        // Validate required fields
        if (!newsData.title || !newsData.content || !newsData.excerpt) {
          return sendResponse(res, 400, { error: 'Title, content, and excerpt are required' });
        }
        
        // Generate slug if not provided
        if (!newsData.slug) {
          newsData.slug = newsData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        
        // Check if slug already exists
        const existingNews = await News.findOne({ slug: newsData.slug });
        if (existingNews) {
          return sendResponse(res, 400, { error: 'News slug already exists' });
        }
        
        // Set author to current user
        newsData.author = user._id;
        
        const newNews = new News(newsData);
        await newNews.save();
        await newNews.populate('author', 'name email');
        await newNews.populate('categoryId', 'name slug');
        await newNews.populate('subcategoryId', 'name slug');
        
        sendResponse(res, 201, newNews);
        break;

      case 'PUT':
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'News ID required' });
        }
        
        const updateData = await parseBody(req);
        
        // Check if news exists
        const existingNews = await News.findById(id);
        if (!existingNews) {
          return sendResponse(res, 404, { error: 'News article not found' });
        }
        
        // If slug is being updated, check for conflicts
        if (updateData.slug && updateData.slug !== existingNews.slug) {
          const slugConflict = await News.findOne({ 
            slug: updateData.slug, 
            _id: { $ne: id } 
          });
          if (slugConflict) {
            return sendResponse(res, 400, { error: 'News slug already exists' });
          }
        }
        
        const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true })
          .populate('author', 'name email')
          .populate('categoryId', 'name slug')
          .populate('subcategoryId', 'name slug');
        
        sendResponse(res, 200, updatedNews);
        break;

      case 'DELETE':
        if (!user || user.role !== 'admin') {
          return sendResponse(res, 403, { error: 'Admin access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'News ID required' });
        }
        
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
          return sendResponse(res, 404, { error: 'News article not found' });
        }
        
        sendResponse(res, 200, { success: true, message: 'News article deleted successfully' });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('News controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };