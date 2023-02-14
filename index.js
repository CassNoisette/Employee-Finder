
// DEPENDENCIES
const inquirer = require("inquirer");

const fs = require("fs/promises");
const mysql = require("mysql2");
const util = require("util");
// const console = require("console.table");
const { rootCertificates } = require("tls");

// // CONNECTION TO DATABASE
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "rootroot",
//     database: "employees_db"

// });

connection.connect(function (err){
    if (err) throw err;
});

runDatabase();

function runDatabase() {
    inquirer.prompt({
        name: 'questions',
        type: 'list',
        message: 'Select one option',
        choices: ['View all employees', 'View all departments', 'Search by employee', 'Search by department', 'Search by role', 'Add employee', "Add department", 'Add role'],
    })
        .then(function (answer) {
            switch (answer.questions) {
                case "View all employees":
                    showAllEmployees();
                    break;

                case "View all departments":
                    showAllDepartments();
                    break;

                case "Search by employee":
                    searchEmployee();
                    break;

                case "Search by department":
                    searchDepartment();
                    break;

                case "Search by role":
                    searchRole();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Return to menu":
                    connection.end();
                    break;
            }
        });
}

function showAllEmployees() {
    var allEmployees = [];
    var query = "SELECT employee.id, first_name, last_name, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, function (err, result) {
        if (err) throw err;

        var employees = [];


        for (var i = 0; i < result.length; i++) {

            employees = [];

            employees.push(result[i].id);
            employees.push(result[i].first_name);
            employees.push(result[i].last_name);
            employees.push(result[i].role);
            employees.push(result[i].department);

            allEmployees.push(employees);
        }
        prompt.quit();
    });
}

function searchEmployee() {
    var query = "SELECT employee.id, first_name, last_name, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Employee first name"
        },
        {
            name: "firstname",
            type: "input",
            message: "Employee last name"
        }

    ])

        .then(function (answer) {

            var employeeDb = [];
            var searchEmployee = [];

            connection.query(query, function (err, result) {
                if (err) throw err;

                for (var i = 0; i < result.length; i++) {
                    if (result[i].title === answer.role) {
                        searchEmployee.push(result[i].id);
                        searchEmployee.push(result[i].first_name);
                        searchEmployee.push(result[i].last_name);
                        searchEmployee.push(result[i].role);
                        searchEmployee.push(result[i].department);

                        employeeDb.push(searchEmployee);
                    }
                }

                promptQuit();

            });

        });
}

// add employee

function addEmployee() {
    connection.query("SELECT * FROM employee_role", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstname",
                type: "input",
                message: "Employee first name"
            },
            {
                name: "lastname",
                type: "input",
                message: "Employee last name"
            },
            {
                name: "role",
                type: "list",
                message: "Employee's role",
                choices: function () {
                    var choices = [];

                    for (var i = 0; i < result.length; i++) {
                        choices.push(result[i].title);
                    }
                    return choices;
                }
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM role WHERE?", { title: answer.role }, function (err, result) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET", {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role: result[0].id
                });
            })
            promptQuit();
        });
    })

    // add Department
    function addDepartment() {
        inquirer.prompt({
            type: "input",
            name: 'addDepartment',
            message: "Department name"

        })
            .then(function (answer) {
                connection.query('INSERT INTO department SET', { department_name: answer.addDepartment }, function (err) {
                    if (err) throw err;
                });
                promptQuit();
            });
    }
}
    // add role
    function addRole() {
        connection.query("SELECT * FROM department", function (err, result) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: "role",
                    type: "input",
                    message: "Role title"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "Role base salary"
                },
{
                    name: "role_department",
                    type: "input",
                    message: "Department associated with role",
                    choices: function () {
                        var choices = [];
                        for (var i = 0; i < result.length; i++) {
                            choices.push(result[i].department)
                        }
                        return choices
                    }

                }
            ])
                .then(function (answer) {
                    connection.query("SELECT * FROM department WHERE ?", { department: answer.department }, function (err, result) {
                        if (err) throw err;

                        connection.query("INSERT INTO role SET ?", {
                            title: answer.role,
                            salary: parseInt(answer.salary),
                            department_id: parseInt(result[0].id)
                        });
                    })
                        promptQuit();
                    });
                });
        }
