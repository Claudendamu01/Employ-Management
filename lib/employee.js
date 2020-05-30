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

class Employee {
    constructor(firstName, lastName, roleId, managerId)
    {
        this.firstName = firstName,
        this.lastName = lastName,
        this.roleId = roleId,
        this.managerId = managerId
    }
    addEmployee(){
        console.log("adding employee")
        connection.query("INSERT INTO employee SET ?", {first_name: this.firstName, last_name: this.lastName, role_id: this.roleId, manager_id: this.managerId}, function(err){
            if(err) throw err;
            console.log("Employee created succesfully!")
        })
    }
}

module.exports = Employee;