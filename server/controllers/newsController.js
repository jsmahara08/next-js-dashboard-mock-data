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

async function handleRequest(req, res, method, id, query) {
  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single news article
          const news = await News.findById(id).populate('author', 'name email');
          if (!news) {
            return sendResponse(res, 404, { error: 'News article not found' });
          }
          sendResponse(res, 200, news);
        } else {
          // Get all news articles
          const news = await News.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, news);
        }
        break;

      case 'POST':
        // Create new news article
        const newsData = await parseBody(req);
        const newNews = new News(newsData);
        await newNews.save();
        await newNews.populate('author', 'name email');
        sendResponse(res, 201, newNews);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'News ID required' });
        }
        // Update news article
        const updateData = await parseBody(req);
        const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true })
          .populate('author', 'name email');
        if (!updatedNews) {
          return sendResponse(res, 404, { error: 'News article not found' });
        }
        sendResponse(res, 200, updatedNews);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'News ID required' });
        }
        // Delete news article
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
          return sendResponse(res, 404, { error: 'News article not found' });
        }
        sendResponse(res, 200, { success: true });
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