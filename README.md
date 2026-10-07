# Student Academic Personal and Career Profiling System

This Node.js application provides a student entry form and a student records table backed by MongoDB.

## Setup

1. Install Node.js.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
4. Replace `MONGODB_URI` with the connection string from the byteXL MongoDB workspace. If it is not set, the app uses the local MongoDB URI `mongodb://127.0.0.1:27017/student-career-profiling`.
5. Start the application:

   ```bash
   npm start
   ```

The app runs at [http://localhost:3000](http://localhost:3000).

## Routes

- `GET /` displays the student entry form.
- `POST /students` validates and stores a student in MongoDB.
- `GET /students` displays all stored students.

The terminal prints `MongoDB connected successfully` and `Server running on port 3000` after a successful connection.
