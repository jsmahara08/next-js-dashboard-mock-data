const MCQ = require('../models/MCQ');

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
          // Get single MCQ
          const mcq = await MCQ.findById(id);
          if (!mcq) {
            return sendResponse(res, 404, { error: 'MCQ not found' });
          }
          sendResponse(res, 200, mcq);
        } else {
          // Get all MCQs
          const mcqs = await MCQ.find().sort({ createdAt: -1 });
          sendResponse(res, 200, mcqs);
        }
        break;

      case 'POST':
        // Create new MCQ
        const mcqData = await parseBody(req);
        const newMCQ = new MCQ(mcqData);
        await newMCQ.save();
        sendResponse(res, 201, newMCQ);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'MCQ ID required' });
        }
        // Update MCQ
        const updateData = await parseBody(req);
        const updatedMCQ = await MCQ.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedMCQ) {
          return sendResponse(res, 404, { error: 'MCQ not found' });
        }
        sendResponse(res, 200, updatedMCQ);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'MCQ ID required' });
        }
        // Delete MCQ
        const deletedMCQ = await MCQ.findByIdAndDelete(id);
        if (!deletedMCQ) {
          return sendResponse(res, 404, { error: 'MCQ not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MCQ controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };