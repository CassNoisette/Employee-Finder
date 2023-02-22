INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 90000, 1),
       ("Senior Engineer", 150000, 2),
       ("Software Developer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 2),
       ("Lawyer", 190000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Jack", "Daniel", 2, 1),
       ("Angelina", "Rodriguez", 3, NULL),
       ("Darrin", "Johnson", 4, 3),
       ("Kevin", "Hart", 5, NULL),
       ("Shamirah", "Brown", 6, 5),
       ("Sarah", "Geer", 7, NULL),
       ("Joe", "Boy", 8, 7);
