const Course = require('../models/Course');

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
          // Get single course
          const course = await Course.findById(id)
            .populate('categoryId', 'name slug')
            .populate('subcategoryId', 'name slug');
          if (!course) {
            return sendResponse(res, 404, { error: 'Course not found' });
          }
          sendResponse(res, 200, course);
        } else {
          // Get all courses
          const courses = await Course.find()
            .populate('categoryId', 'name slug')
            .populate('subcategoryId', 'name slug')
            .sort({ createdAt: -1 });
          sendResponse(res, 200, courses);
        }
        break;

      case 'POST':
        // Create new course
        const courseData = await parseBody(req);
        const newCourse = new Course(courseData);
        await newCourse.save();
        await newCourse.populate('categoryId', 'name slug');
        await newCourse.populate('subcategoryId', 'name slug');
        sendResponse(res, 201, newCourse);
        break;

      case 'PUT':
        if (!id) {
          return sendResponse(res, 400, { error: 'Course ID required' });
        }
        // Update course
        const updateData = await parseBody(req);
        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true })
          .populate('categoryId', 'name slug')
          .populate('subcategoryId', 'name slug');
        if (!updatedCourse) {
          return sendResponse(res, 404, { error: 'Course not found' });
        }
        sendResponse(res, 200, updatedCourse);
        break;

      case 'DELETE':
        if (!id) {
          return sendResponse(res, 400, { error: 'Course ID required' });
        }
        // Delete course
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
          return sendResponse(res, 404, { error: 'Course not found' });
        }
        sendResponse(res, 200, { success: true });
        break;

      default:
        sendResponse(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Course controller error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = { handleRequest };