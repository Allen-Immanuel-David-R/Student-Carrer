require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-career-profiling';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/students', async (req, res, next) => {
  try {
    await Student.create({
      name: req.body.name,
      registerNumber: req.body.registerNumber,
      department: req.body.department,
      year: req.body.year
    });

    res.redirect('/students?added=true');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send('Please provide a valid name, register number, department, and year.');
    }

    next(error);
  }
});

app.get('/students', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    const addedMessage = req.query.added === 'true';

    res.send(renderStudentsPage(students, addedMessage));
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Unable to process the request. Please try again.');
});

function renderStudentsPage(students, addedMessage) {
  const rows = students.length
    ? students
        .map(
          (student) => `
            <tr>
              <td>${escapeHtml(student.name)}</td>
              <td>${escapeHtml(student.registerNumber)}</td>
              <td>${escapeHtml(student.department)}</td>
              <td>${student.year}</td>
            </tr>`
        )
        .join('')
    : '<tr><td colspan="4" class="empty">No student records found.</td></tr>';

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Records</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <main class="container">
          <div class="page-header">
            <div>
              <p class="eyebrow">Student Career Profiling</p>
              <h1>Student records</h1>
            </div>
            <a class="button secondary" href="/">Add student</a>
          </div>
          ${addedMessage ? '<p class="success" role="status">Student added successfully.</p>' : ''}
          <section class="card">
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Register number</th>
                    <th>Department</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </section>
        </main>
      </body>
    </html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function startServer() {
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
