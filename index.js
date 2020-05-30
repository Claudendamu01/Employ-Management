const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require("console.table")

const Employee = require("./lib/employee")
const Department = require("./lib/department")
const Role = require("./lib/role")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw (err);
    initialize();
})


function initialize() {
    const choiceArr = ["Add", "View", "Update Employee", "Quit"]
    inquirer.prompt([{
        type: "rawlist",
        message: "Welcome to the Employee Manager! \n What would you like to do?",
        choices: choiceArr,
        name: "userChoice"
    }]).then(function (ans) {
        if (ans.userChoice === choiceArr[0]) {
            addTo();
        }
        else if (ans.userChoice === choiceArr[1]) {
            tableView();
        }
        else if (ans.userChoice === choiceArr[2]) {
            updateEmployee();
        }
        else if (ans.userChoice === choiceArr[3]) {
            connection.end()
        }
    })
}

function addTo() {
    const addChoiceArr = ["Department", "Employee", "Role"]
    inquirer.prompt({
        type: "rawlist",
        message: "What would you like to add?",
        choices: addChoiceArr,
        name: "addChoice"
    }).then(function (ans) {
        if (ans.addChoice === addChoiceArr[0]) {
            addNewDepartment()
        }
        else if (ans.addChoice === addChoiceArr[1]) {
            addNewEmployee()
        }
        else if (ans.addChoice === addChoiceArr[2]) {
            addNewRole()
        }
    })
}

function addNewDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the department you would like to create?",
        name: "depName"
    }]).then(function (res) {
        const newDep = new Department(res.depName);
        newDep.addDepartment();
        initialize();
    })
}

function addNewRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const departments = res;
        //console.log(departments)
        const depArr = []
        for (let row of departments) {
            depArr.push(row.name);
            //console.log(row)
        }
        //console.log(depArr)
        inquirer.prompt([{
            type: "input",
            message: "What is the name of the role you would like to create?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the starting salary of the role you are creating?",
            name: "roleSalary"
        },
        {
            type: "rawlist",
            message: "What department would like to add this role to?",
            name: "roleDep",
            choices: depArr
        }
        ]).then(function (res) {
            connection.query("SELECT id FROM department WHERE name = ?", [res.roleDep], function (err, results) {
                if (err) throw err;
                const newRole = new Role(res.roleTitle, res.roleSalary, results[0].id)
                newRole.addRole();
                initialize();
            })

        })
    })
}

function addNewEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const roles = res;
        //console.log(departments)
        const roleArr = []
        for (let row of roles) {
            roleArr.push(row.title);
            //console.log(row)
        }
        inquirer.prompt([{
            type: "input",
            message: "What is your new employee's first name?",
            name: "first",
        },
        {
            type: "input",
            message: "What is your employee's last name?",
            name: "last"
        },
        {
            type: "rawlist",
            message: "what role is your new employee filling?",
            choices: roleArr,
            name: "role"
        },
        {
            type: "input",
            message: "Enter your new employee's manager id. (Set as 0 if new employee is manager)",
            name: "manager"
        }]).then(function (ans) {
            connection.query("SELECT id FROM role WHERE title = ?", [ans.role], function (err, results) {
                if (err) throw err;
                const newEmp = new Employee(ans.first, ans.last, results[0].id, ans.manager)
                console.log(newEmp)
                newEmp.addEmployee();
            })
        })
    })
}

function tableView() {
    const viewChoice = ["Departments", "Employees", "Roles"]
    inquirer.prompt({
        type: "rawlist",
        message: "What would you like to view?",
        choices: viewChoice,
        name: "choice"
    }).then(function (ans) {
        if (ans.choice === viewChoice[0]) {
            viewDepartments();
        }
        else if (ans.choice === viewChoice[1]) {
            viewEmployees();
        }
        else if (ans.choice === viewChoice[2]) {
            viewRoles();
        }
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res)
        initialize();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res)
        initialize();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res)
        initialize();
    })
}

function updateEmployee() {
    var employeeId = 0;
    var roleArr = []
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        const empId = []
        for (let employee of res) {
            empId.push(employee.id)
        }
        inquirer.prompt({
            type: "rawlist",
            message: "Which employee would like to update?",
            choices: empId,
            name: "employeeId"
        }).then(function (ans) {
            employeeId = ans.employeeId
            roleQueryUpdate(employeeId);
        })
    })
}

function roleQueryUpdate(employeeId){
    connection.query("SELECT * FROM role"), function (err, results) {
        if (err) throw err;
        var roles = results;
        for (let row of roles) {
            roleArr.push(row.title);
        }
        inquirer.prompt({
            input: "rawlist",
            message: "What role would you like to assign to this employee?",
            choices: roleArr,
            name: "updatedRole"
        }).then(function (answer) {
            connection.query("SELECT id FROM role WHERE title = ?", [answer.updatedRole], function (err, response) {
                if (err) throw err;
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [response[0].id, employeeId])
                console.log("Employee role updated!")
                initialize();
            })
        })
    }

}
