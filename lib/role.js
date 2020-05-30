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

class Role{
    constructor(title, salary, depId){
        this.title = title,
        this.salary = salary, 
        this.depId = depId
    }

    addRole(){
        connection.query("INSERT INTO role SET ?", {title: this.title, salary: this.salary, department_id: this.depId}, function(err){
            if(err) throw err;
            console.log("Role created succesfully!")
        })
    }
}

module.exports = Role;