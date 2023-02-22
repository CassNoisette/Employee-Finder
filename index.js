
// DEPENDENCIES
const inquirer = require("inquirer");

const fs = require("fs/promises");
const mysql2 = require("mysql2");
const util = require("util");
const console = require("console.table");


// CONNECTION TO DATABASE
const connection = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_db"

});

// search database
runDatabase();

// provide the prompts
function runDatabase() {
    inquirer.prompt({
        name: 'questions',
        type: 'list',
        message: 'Select one option',
        choices: ['View all employees', 'View all departments','View all roles', 'Add employee', "Add department", 'Add role', 'Update employee role'],
    })
        .then((answers) => {
            switch (answers.questions) {
                case "View all employees":
                    connection
                    .promise()
                    .query(
                        'SELECT employees.id AS "ID", employees.first_name, employees.last_name, roles.titles AS "ROLE", department_name AS "Department", roles.salary AS "SALARY", CONCAT(mgr.first_name, " ", mgr.last_name) AS "Manager" FROM employees workers LEFT JOIN employees mgr ON employees.manager_id = mgr.id INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON department_id = departments.id ORDER BY employees.id;'
                    ).then (([rows]) => {
                        console.table(rows);
                        runDatabase();
                    });
                    break;

                case "View all departments":
                    connection
            .promise()
            .query(
              'SELECT id AS "ID", department_name AS "Department Name" FROM departments ORDER BY id;'
            )
            .then(([rows]) => {
              console.table(rows);
              runDatabase();
            });
          break;

        case "View all roles":
          connection
            .promise()
            .query(
              'SELECT roles.id AS "ID", title AS "Roles", salary AS "Salary", department_name AS "Departments"  FROM roles INNER JOIN departments ON roles.department_id = departments.id ORDER BY roles.id;'
            )
            .then(([rows]) => {
              console.table(rows);
              runDatabase();
            });
          break;

    case "Add employee":
        connection
        .promise()
        .query("SELECT * FROM employee_role", function (err, result) {
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
            ]).then(function (answers) {
                connection.query("SELECT * FROM role WHERE?", { title: answers.role }, function (err, result) {
                    if (err) throw err;
    
                    connection
                    .promise()
                    .query("INSERT INTO employee SET", {
                        first_name: answers.firstname,
                        last_name: answers.lastname,
                        role: result[0].id
                    });
                })
                runDatabase();
            });
        })
                    break;

                case "Add department":
                   inquirer
                   .prompt([
                    {
                    name: "Department",
                    type: "input",
                    message: "Add a department",
                },
                   ])
                   .then((answer) => {
                    connection
                    .promise()
                    .execute(
                        "INSERT INTO departments (department_name) VALUES (" +
                    "'" +
                    answer.Department +
                    "');"
                    )
                    .then(() => {
                        console.log("Department was added");
                        runDatabase();
                    });
                   });
                    break;

                case "Add role":
                    let departments = [];
                    connection
                    .promise()
                    .query("SELECT department_name FROM departments ORDER BY id;")
                    .then(([rows]) => {
                      for (row of rows) {
                        departments.push(row.department_name);
                      }
                      inquirer
                        .prompt([
                          {
                            name: "Role",
                            type: "input",
                            message: "Add a role",
                          },
                          {
                            name: "Salary",
                            type: "input",
                            message:
                              "Add a salary",
                          },
                          {
                            name: "Role_department",
                            type: "list",
                            message:
                              "Add a department for the selected role",
                            choices: departments,
                          },
                        ])
                        .then((answer) => {
                          let deptID;
                          connection
                            .promise()
                            .query(
                              "SELECT id FROM departments WHERE department_name = " +
                                "'" +
                                answer.Role_department +
                                "';"
                            )
                            .then(([rows]) => {
                              deptID = rows[0].id;
        
                              connection
                                .promise()
                                .execute(
                                  "INSERT INTO roles (title, salary, department_id) VALUES (" +
                                    "'" +
                                    answer.Role +
                                    "', " +
                                    "'" +
                                    answer.Salary +
                                    "', " +
                                    "'" +
                                    deptID +
                                    "'" +
                                    ");"
                                )
                                .then(() => {
                                  console.log("Role was added");
                                  runDatabase();
                                });
                            });
                        });
                    });
                    break;

                case "Update employee role":
                    let currentEmployees = [];
          let roles = [];
          let employeeID;
          let role_id;
          connection
            .promise()
            .query(
              "SELECT CONCAT(first_name, ' ', last_name) AS 'Employee' FROM employees"
            )
            .then(([rows]) => {
              for (row of rows) {
                currentEmployees.push(row.Employee);
              }
              connection
                .promise()
                .query("SELECT title FROM roles")
                .then(([rows]) => {
                  for (row of rows) {
                    roles.push(row.title);
                  }
                  inquirer
                    .prompt([
                      {
                        name: "update_Employee",
                        type: "list",
                        message: "Select employee to update role",
                        choices: currentEmployees,
                      },
                      {
                        name: "new_Role",
                        type: "list",
                        message: "Add new role",
                        choices: roles,
                      },
                    ])
                    .then((answer) => {
                      let employee = answer.updated_Employee.split(" ");
                      connection
                        .promise()
                        .query(
                          "SELECT id FROM employees WHERE first_name = " +
                            "'" +
                            employee[0] +
                            "'" +
                            "AND last_name = " +
                            "'" +
                            employee[1] +
                            "';"
                        )
                        .then(([rows]) => {
                          console.log(rows);
                          employeeID = rows[0].id;
                          connection
                            .promise()
                            .query(
                              "SELECT id FROM roles WHERE title = " +
                                "'" +
                                answer.new_Role +
                                "';"
                            )
                            .then(([rows]) => {
                              role_id = rows[0].id;
                              connection
                                .promise()
                                .execute(
                                  "UPDATE employees SET role_id = " +
                                    role_id +
                                    " WHERE id = " +
                                    employeeID +
                                    ";"
                                );
                              console.log("updated role successfully");
                              searchDatabase();
                            });
                        });
                    });
                });
            });
        default:
          console.log("something went wrong");
        }
});
}
