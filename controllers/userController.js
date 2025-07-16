const con = require('../db/connection')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.registerUser = (req, res) => {
  const { username, email, password, uploadedUrl } = req.body;

  const checkQuery = 'SELECT * FROM user_detail WHERE email = ?';
  con.query(checkQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertQuery = 'INSERT INTO user_detail (username, email, password, user_profile) VALUES (?, ?, ?,?)';
    con.query(insertQuery, [username, email, hashedPassword, uploadedUrl], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'User created', userId: result.insertId });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM user_detail WHERE email = ?';
  con.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
};
exports.getUserProfile = (req, res) => {
  const { email } = req.query;
  con.query('SELECT * FROM user_detail WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ userdata: results[0] }); 
  });
};
