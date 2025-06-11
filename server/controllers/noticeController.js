const Notice = require('../models/Notice');

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
          // Get single notice
          const notice = await Notice.findById(id)
            .populate('author', 'name email')
            .populate('categoryId', 'name slug');
          
          if (!notice) {
            return sendResponse(res, 404, { error: 'Notice not found' });
          }

          // Increment view count
          notice.viewCount += 1;
          await notice.save();
          
          sendResponse(res, 200, notice);
        } else {
          // Get all notices with filters
          const filter = {};
          
          if (query.status) {
            filter.status = query.status;
          }
          
          if (query.type) {
            filter.type = query.type;
          }
          
          if (query.category) {
            filter.categoryId = query.category;
          }

          const notices = await Notice.find(filter)
            .populate('author', 'name email')
            .populate('categoryId', 'name slug')
            .sort({ isSticky: -1, createdAt: -1 });
          
          sendResponse(res, 200, notices);
        }
        break;

      case 'POST':
        // Check authentication for write operations
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        const noticeData = await parseBody(req);
        
        // Validate required fields
        if (!noticeData.title || !noticeData.content) {
          return sendResponse(res, 400, { error: 'Title and content are required' });
        }
        
        // Set author to current user
        noticeData.author = user._id;
        
        const newNotice = new Notice(noticeData);
        await newNotice.save();
        await newNotice.populate('author', 'name email');
        await newNotice.populate('categoryId', 'name slug');
        
        sendResponse(res, 201, newNotice);
        break;

      case 'PUT':
        if (!user || !['admin', 'editor'].includes(user.role)) {
          return sendResponse(res, 403, { error: 'Admin or editor access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'Notice ID required' });
        }
        
        const updateData = await parseBody(req);
        
        const updatedNotice = await Notice.findByIdAndUpdate(id, updateData, { new: true })
          .populate('author', 'name email')
          .populate('categoryId', 'name slug');
        
        if (!updatedNotice) {
          return sendResponse(res, 404, { error: 'Notice not found' });
        }
        
        sendResponse(res, 200, updatedNotice);
        break;

      case 'DELETE':
        if (!user || user.role !== 'admin') {
          return sendResponse(res, 403, { error: 'Admin access required' });
        }
        
        if (!id) {
          return sendResponse(res, 400, { error: 'Notice ID required' });
        }
        
        const deletedNotice = await Notice.findByIdAndDelete(id);
        if (!deletedNotice) {
          return sendResponse(res, 404, { error: 'Notice not found' });
        }
        
        sendResponse(res, 200, { success: true, message: 'Notice deleted successfully' });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notice controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };