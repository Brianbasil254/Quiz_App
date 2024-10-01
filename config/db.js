const mysql2 = require('mysql2');

const db = mysql2.createConnection({
    host: 'localhost', 
    user: 'root',       
    password: 'Brian@254', 
    database: 'quizdb',
    port: 3307  
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
