# Admin Panel with MongoDB Integration

A comprehensive admin panel built with Next.js frontend and Node.js backend with MongoDB integration using Mongoose.

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete for all entities
- **MongoDB Integration**: Real database with Mongoose ODM
- **Manual Routing**: Custom HTTP server with manual route handling
- **Real-time Data**: Live data from MongoDB instead of mock data
- **Responsive Design**: Modern UI with shadcn/ui components
- **Authentication**: Admin login system
- **Rich Text Editor**: TipTap editor for content creation

## Tech Stack

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TipTap rich text editor

### Backend
- Node.js (native HTTP module)
- MongoDB with Mongoose
- Manual routing system
- Environment variables with dotenv
- CORS support

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/admin_panel
   PORT=3001
   JWT_SECRET=your_jwt_secret_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the backend server**
   ```bash
   npm run server
   # or for development with auto-restart
   npm run dev:server
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Admin Login: http://localhost:3000/admin/login

### Default Admin Credentials
- Email: `admin@example.com`
- Password: `password`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get news article by ID
- `POST /api/news` - Create new news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### MCQs
- `GET /api/mcqs` - Get all MCQs
- `GET /api/mcqs/:id` - Get MCQ by ID
- `POST /api/mcqs` - Create new MCQ
- `PUT /api/mcqs/:id` - Update MCQ
- `DELETE /api/mcqs/:id` - Delete MCQ

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### CMS Pages
- `GET /api/cms` - Get all CMS pages
- `GET /api/cms/:id` - Get CMS page by ID
- `POST /api/cms` - Create new CMS page
- `PUT /api/cms/:id` - Update CMS page
- `DELETE /api/cms/:id` - Delete CMS page

### Site Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- role (String, enum: admin/editor/viewer)
- status (String, enum: active/inactive)
- avatar (String)
- lastLogin (Date)

### News
- title (String, required)
- content (String, required)
- excerpt (String, required)
- slug (String, required, unique)
- featuredImage (String)
- status (String, enum: published/draft)
- publishDate (Date)
- author (ObjectId, ref: User)
- tags (Array of Strings)

### Question
- question (String, required)
- answer (String, required)
- category (String, required)
- status (String, enum: published/draft)
- createdBy (ObjectId, ref: User)

### MCQ
- question (String, required)
- options (Array of option objects)
- explanation (String)
- difficulty (String, enum: easy/medium/hard)
- category (String, required)
- tags (Array of Strings)
- status (String, enum: active/inactive)

### Category
- name (String, required)
- slug (String, required, unique)
- description (String)
- parentId (ObjectId, ref: Category)
- status (String, enum: active/inactive)

### Course
- title (String, required)
- description (String, required)
- slug (String, required, unique)
- featuredImage (String)
- price (Number, required)
- status (String, enum: published/draft)
- categoryId (ObjectId, ref: Category)
- subcategoryId (ObjectId, ref: Category)
- instructor (String, required)
- duration (Number, required)
- level (String, enum: beginner/intermediate/advanced)
- lessons (Array of lesson objects)

### Quiz
- title (String, required)
- description (String, required)
- timeLimit (Number)
- passingScore (Number, required)
- status (String, enum: active/inactive)
- questions (Array of ObjectId, ref: MCQ)

### CMSPage
- title (String, required)
- slug (String, required, unique)
- content (String, required)
- status (String, enum: published/draft)

### SiteSettings
- siteName (String, required)
- logo (String)
- favicon (String)
- primaryColor (String)
- contactEmail (String, required)
- socialLinks (Object)
- footer (Object)

## Project Structure

```
├── server/                 # Backend Node.js server
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   └── index.js           # Main server file
├── app/                   # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes (unused, using custom server)
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── .env                   # Environment variables
```

## Development

### Adding New Features

1. **Create Mongoose Model**: Add new model in `server/models/`
2. **Create Controller**: Add controller in `server/controllers/`
3. **Update Router**: Add route handling in `server/index.js`
4. **Update API Client**: Add methods in `lib/api.ts`
5. **Create Frontend Pages**: Add pages in `app/admin/`

### Database Seeding

The server automatically seeds initial data on startup:
- Default admin user
- Default site settings

### Error Handling

- All API endpoints include proper error handling
- Frontend displays user-friendly error messages
- Server logs detailed error information

## Production Deployment

1. **Set up MongoDB**: Use MongoDB Atlas or self-hosted instance
2. **Update Environment Variables**: Set production values
3. **Build Frontend**: `npm run build`
4. **Start Production Server**: `npm start`
5. **Configure Reverse Proxy**: Use Nginx or similar for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.