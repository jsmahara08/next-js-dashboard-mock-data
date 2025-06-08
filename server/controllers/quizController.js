const Quiz = require('../models/Quiz');

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
          // Get single quiz
          const quiz = await Quiz.findById(id).populate('questions');
          if (!quiz) {
            return sendResponse(res, 404, { error: 'Quiz not found' });
          }
          sendResponse(res, 200, quiz);
        } else {
          // Get all quizzes
          const quizzes = await Quiz.find()
            .populate('questions')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, quizzes);
        }
        break;

      case 'POST':
        // Create new quiz
        const quizData = await parseBody(req);
        const newQuiz = new Quiz(quizData);
        await newQuiz.save();
        await newQuiz.populate('questions');
        sendResponse(res, 201, newQuiz);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'Quiz ID required' });
        }
        // Update quiz
        const updateData = await parseBody(req);
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, { new: true })
          .populate('questions');
        if (!updatedQuiz) {
          return sendResponse(res, 404, { error: 'Quiz not found' });
        }
        sendResponse(res, 200, updatedQuiz);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'Quiz ID required' });
        }
        // Delete quiz
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
          return sendResponse(res, 404, { error: 'Quiz not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Quiz controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };