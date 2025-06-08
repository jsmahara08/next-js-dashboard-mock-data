const Question = require('../models/Question');

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
          // Get single question
          const question = await Question.findById(id).populate('createdBy', 'name email');
          if (!question) {
            return sendResponse(res, 404, { error: 'Question not found' });
          }
          sendResponse(res, 200, question);
        } else {
          // Get all questions
          const questions = await Question.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, questions);
        }
        break;

      case 'POST':
        // Create new question
        const questionData = await parseBody(req);
        const newQuestion = new Question(questionData);
        await newQuestion.save();
        await newQuestion.populate('createdBy', 'name email');
        sendResponse(res, 201, newQuestion);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'Question ID required' });
        }
        // Update question
        const updateData = await parseBody(req);
        const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, { new: true })
          .populate('createdBy', 'name email');
        if (!updatedQuestion) {
          return sendResponse(res, 404, { error: 'Question not found' });
        }
        sendResponse(res, 200, updatedQuestion);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'Question ID required' });
        }
        // Delete question
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) {
          return sendResponse(res, 404, { error: 'Question not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Question controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };