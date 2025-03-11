const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Snkumar30',
    database: 'budget_finance'
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: 'Signup Failed' });
        res.json({ message: 'Signup Successful!' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (results.length === 0) return res.status(400).json({ error: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

        const token = jwt.sign({ id: results[0].id }, 'your_secret_key');
        res.json({ token });
    });
});

app.get('/user', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = decoded.id;
        const sql = 'SELECT name FROM users WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch user data' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ name: results[0].name });
        });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));