# Engineering Hub

A full-stack web platform for engineering news, articles, and technology innovations - built with React, Node.js, and Express. Similar to Interesting Engineering.

## Project Structure

```
engineering-hub/
├── backend/              # Node.js + Express API
│   ├── package.json     # Backend dependencies
│   └── server.js        # Main Express server
├── frontend/             # React.js application
│   ├── package.json     # Frontend dependencies
│   ├── App.js           # Main React component
│   └── App.css          # Styling
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API
- **Middleware**: CORS, dotenv
- **Dev Tool**: Nodemon

### Frontend
- **Library**: React 18.2
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Styling**: CSS3 + Tailwind CSS
- **Build Tool**: React Scripts

## Features

- 📰 Browse engineering news and articles
- 🏷️ Categorized content (Tech, AI, Green Energy, etc.)
- 📅 Article filtering by date
- 🎨 Modern, responsive UI design
- ⚡ Fast API with Express backend
- 📱 Mobile-friendly interface

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
PORT=5000
NODE_ENV=development
# Add MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/engineering-hub
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if API is running

### Articles
- **GET** `/api/articles` - Get all articles
- **POST** `/api/articles` - Create a new article
- **GET** `/api/articles/:id` - Get article by ID
- **PUT** `/api/articles/:id` - Update article
- **DELETE** `/api/articles/:id` - Delete article

## Running the Application

### Development Mode

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Production Build

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm start
```

## Project Roadmap

- [ ] Add MongoDB database integration
- [ ] Implement user authentication (JWT)
- [ ] Add search functionality
- [ ] Implement article pagination
- [ ] Add comments and ratings
- [ ] Create admin dashboard
- [ ] Add email notifications
- [ ] Implement caching with Redis
- [ ] Add unit and integration tests
- [ ] Deploy to production (Heroku/AWS)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
