const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aishu@2003',
  database: 'library'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});


app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    
    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    const values = [username, email, password, 'user']; 
    
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ message: 'Failed to signup' });
        return;
      }
      console.log('User signed up successfully');
      res.status(200).json({ message: 'Successfully signed up' }); 
    });
  });



app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, result) => {
      if (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Failed to login' });
        return;
      }
  
      if (result.length === 0) {
        console.log('User not found');
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      console.log('User logged in successfully:', result[0]);
      const userRole = result[0].role; // Assuming role is stored in the database
      if (userRole === 'admin') {
        res.status(200).json({ message: 'Admin logged in successfully' });
      } else {
        res.status(200).json({ message: 'User logged in successfully' });
      }
    });
  });

// API to add a new book
app.post('/api/books', (req, res) => {
  const { title, author, subject, publish_date } = req.body;
  const sql = `INSERT INTO books (title, author, subject, publish_date) VALUES (?, ?, ?, ?)`;
  db.query(sql, [title, author, subject, publish_date], (err, result) => {
    if (err) throw err;
    console.log('Book added successfully');
    res.json({ message: 'Book added successfully' });
  });
});

// API to fetch all books
app.get('/api/books', (req, res) => {
    const sql = `SELECT * FROM books`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
