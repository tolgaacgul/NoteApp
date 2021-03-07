const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "db_noteapp"
})

connection.connect()

module.exports = {
    db : connection
}