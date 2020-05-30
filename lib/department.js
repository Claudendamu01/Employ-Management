const mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Mac7500",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw (err);
})

class Department{
    constructor(name){
        this.name = name;
    }
    
    addDepartment(){
        connection.query("INSERT INTO department SET ?", {name: this.name}, function(err){
            if(err) throw err;
            console.log("Department created succesfully!")
        })
    }
}

module.exports = Department;