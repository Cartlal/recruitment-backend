# recruitment-backend
Recruitment System Backend

This is the backend for a recruitment management system. It is built using Node.js, Express, and MongoDB Atlas. The backend provides secure user authentication and APIs for signup, login, and fetching user details from the database.

Features

User account creation with validation

Secure password hashing using bcrypt

Login authentication

Fetch user profile from MongoDB

Environment-based configuration

Ready for deployment on Render, Vercel, or any Node hosting platform

Technologies Used

Node.js

Express.js

MongoDB Atlas

Mongoose

bcryptjs

dotenv

/backend
  server.js
  config.js
  /models
    User.js
  package.json


Installation

Clone the repository

Install dependencies

Create a .env file

Start the server

Commands:


git clone https://github.com/Cartlal/recruitment-backend.git
cd recruitment-backend
npm install


MONGO_URI=your-mongo-uri
PORT=3000
JWT_SECRET=your-secret


node server.js


API Endpoints
POST /signup

Creates a new user.

POST /login

Authenticates a user.

GET /user/:email

Fetches a user by email from MongoDB.

MONGO_URI=
PORT=
JWT_SECRET=




CORS

Project Structure
