// Rhonda Johnson
// assignment 10
// Supervisor Mode

// Include the mysql , inquirer, and cli-table packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    // run the start function after the connection is made 
    start();
});

// start the Bamazon store in "Supervisor" mode
function start() {

    console.log("\n\n  *********************************************");
    console.log("  *       Bamazon  - Supervisor View          *");
    console.log("  *********************************************\n");

    // prompt the user with menu options
    inquirer
        .prompt([
            {
                type: "list",
                message: "Menu Options",
                choices: ["View Sales by Department", "Create New Department", "Exit Program"],
                name: "option"
            },

        ]).then(function (response) {

            switch (response.option) {
                case ("View Sales by Department"):
                    console.log("Option: " + response.option);
                    viewSales();
                    break;

                case ("Create New Department"):
                    console.log("Option: " + response.option);
                    addNewDepartment();
                    break;

                case ('Exit Program'):
                    console.log("Option: " + response.option);
                    console.log("\n  ************************************");
                    console.log("    Exiting Bamazon Supervisor Program. \n         Have a good day.");
                    console.log("  ************************************\n");
                    connection.end();
                    break;
            }
        })
}

// ask the user if they want to continue or exit the program
function continueProgram() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do now?",
                choices: ["Continue Program", "Exit Program"],
                name: "choice"
            },
        ])
        .then(function (answer) {

            // restart if the user wants to make another purchase
            if (answer.choice == "Continue Program") {
                start();
            }
            else {
                console.log("\n  **************************************");
                console.log("    Exiting Bamazon Supervisor Program \n         Have a good day");
                console.log("  **************************************\n");
                connection.end();
            }
        })
}

// Product Sales by Department
function viewSales() {

    console.log("\n\n  *********************************************");
    console.log("  *     Product Sales by Department           *");
    console.log("  *********************************************\n\n");

    // query string to return cost, sales, & profit by department
    var queryString =
        "SELECT d.department_id, d.department_name, d.over_head_costs, Table2.total_sales, " +
        "(Table2.total_sales - d.over_head_costs) as total_profit " +
        "FROM departments as d join " +
        "(SELECT department_name, SUM(product_sales) as total_sales " +
        "FROM products GROUP BY department_name " +
        ") Table2 on d.department_name = Table2.department_name";

    connection.query(queryString, function (err, res) {
        if (err) throw err;

        // instantiate a new Table
        var table = new Table({
            head: ['Id', 'Dept Name', 'OverHead Costs ($)', 'Total Sales ($)', 'Total Profit ($)'],
        });

        for (var i = 0; i < res.length; i++) {
            var record = res[i];
            table.push([record.department_id, record.department_name, record.over_head_costs,
            record.total_sales, record.total_profit]);
        }
        console.log(table.toString());

        // ask user if they want to continue 
        continueProgram();
    })
}


// add a new Department to the store
function addNewDepartment() {

    console.log("\n\n  *********************************************");
    console.log("  *             Add New Department            *");
    console.log("  *********************************************\n\n");

    // prompt user for new product info
    inquirer
        .prompt([
            {
                name: "newDepartment",
                type: "input",
                message: "Enter the name of the new Department:",

            },
            {
                name: "newOverHead",
                type: "input",
                message: "Enter a over-head costs for the new Department:",
                // input should be a valid price > 0
                validate: function validateItem(value) {
                    if (!isNaN(value) && (value > 0)) {
                        return true;
                    }
                    else {
                        console.log("\n   Please enter a valid over-head cost.");
                        return false;
                    }
                }
            }
        ])
        .then(function (response) {

            var newDept = response.newDepartment;
            // convert to decimal value
            var decOverHead = parseFloat(response.newOverHead).toFixed(2);

            // insert the product into the products table
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: newDept,
                    over_head_costs: decOverHead
                },
                function (error) {
                    if (error) throw err;

                    console.log("\n  ********************************************************");
                    console.log("      Department: " + newDept + " added successfully!");
                    console.log("  ********************************************************\n\n")

                    // ask user if they want to continue 
                    continueProgram();
                })
        })
}


