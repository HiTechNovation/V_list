const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dnpl',
  database: 'viveksharma',
  port: 3309,
  timezone:'z',
});

con.connect((err) => {
  if (err) {
    console.error('❌ DB connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

module.exports = con;
