// Rhonda Johnson
// assignment 10
// Manager Mode

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

// start the Bamazon store in "Manager" mode
function start() {

    console.log("\n\n  *********************************************");
    console.log("  *       Bamazon  - Manager View             *");
    console.log("  *********************************************\n");

    // prompt the user with menu options
    inquirer
        .prompt([
            {
                type: "list",
                message: "Menu Options",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Program"],
                name: "option"
            },

        ]).then(function (response) {
            switch (response.option) {
                case ('View Products for Sale'):
                    viewInventory();
                    break;

                case ('View Low Inventory'):
                    viewLowInventory();
                    break;

                case ('Add to Inventory'):
                    addInventory();
                    break;

                case ('Add New Product'):
                    addNewProduct();
                    break;

                case ('Exit Program'):
                    console.log("\n  ************************************");
                    console.log("    Exiting Bamazon Manager Program. \n         Have a good day.");
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
                console.log("\n  ************************************");
                console.log("    Exiting Bamazon Manager Program. \n         Have a good day.");
                console.log("  ************************************\n");
                connection.end();
            }
        })
}

function viewInventory() {
    // display all items in the database
    console.log("\n  *********************************************");
    console.log("  *            Inventory Items                *");
    console.log("  *********************************************\n\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // instantiate a new Table
        var table = new Table({
            head: ['Id', 'Product Name', 'Price ($)', 'Dept', 'QTY', 'Sales ($)'],
        });

        for (var i = 0; i < res.length; i++) {
            var record = res[i];
            table.push([record.item_id, record.product_name, record.price, record.department_name,
            record.stock_quantity, record.product_sales]);
        }
        console.log(table.toString());

        // ask user if they want to continue 
        continueProgram();
    })
}

function viewLowInventory() {
    var lowLimit = 5;
    connection.query("SELECT * FROM products where stock_quantity < " + lowLimit, function (err, res) {
        if (err) throw err;

        //  display low inventory items (quantity < lowLimit)

        if (res.length == 0) {
            console.log("\n  *********************************************");
            console.log("  *   No Low Inventory Items at this time     *");
            console.log("  *********************************************\n\n");

        }
        else {
            console.log("\n\n  *********************************************");
            console.log("  *         Low Inventory Items               *");
            console.log("  *********************************************\n\n");

            // instantiate a new Table
            var table = new Table({
                head: ['Id', 'Product Name', 'Price ($)', 'Dept', 'QTY', 'Sales($)'],
            });

            for (var i = 0; i < res.length; i++) {
                var record = res[i];
                table.push([record.item_id, record.product_name, record.price, record.department_name,
                record.stock_quantity, record.product_sales]);
            }
            console.log(table.toString());
        }

        // ask user if they want to continue 
        continueProgram();
    })
}

// add a quantity to a current item in the store
function addInventory() {

    // query the database for all items being sold
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // display all items in the database
        console.log("  *********************************************");
        console.log("  *            Inventory Items                *");
        console.log("  *********************************************\n\n");

        // instantiate a new Table
        var table = new Table({
            head: ['Id', 'Product Name', 'Price ($)', 'Dept', 'QTY', "Sales ($)"],
        });

        for (var i = 0; i < res.length; i++) {
            var record = res[i];
            table.push([record.item_id, record.product_name, record.price, record.department_name,
            record.stock_quantity, record.product_sales]);
        }
        console.log(table.toString());


        // prompt user for product ID & Quantity
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "input",
                    message: "What is the ID of the product to add inventory?",
                    // input should be a valid item number
                    validate: function validateItem(value) {
                        if (!isNaN(value) && (parseInt(value) > 0) && (parseInt(value) <= res.length)) {
                            return true;
                        }
                        else {
                            console.log("\n   Please enter a valid ID.");
                            return false;
                        }
                    }
                },
                {
                    name: "qty",
                    type: "input",
                    message: "How much inventory would you like to add?",
                    // input should be a number
                    validate: function validateItem(value) {
                        if (isNaN(value)) {
                            console.log("\n   Please enter a valid quantity." + value);
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
            ])
            .then(function (answer) {

                var item = parseInt(answer.choice);
                var howMany = parseInt(answer.qty);
                var cost = 0;
                var currentRecord = res[item - 1];

                // update table & display item with new quantity
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: currentRecord.stock_quantity + howMany
                        },
                        {
                            item_id: item
                        }
                    ],
                    function (error) {
                        if (error) throw err;

                        newTotal = currentRecord.stock_quantity + howMany;
                        console.log("\n  ********************************************************");
                        console.log("     Quantity updated successfully!");
                        console.log("     New Quantity for  " + currentRecord.product_name + " = " + newTotal);
                        console.log("  ********************************************************\n\n")

                        // ask user if they want to continue 
                        continueProgram();
                    })
            })
    })
}

// add a new product to the store
function addNewProduct() {
    console.log("\n\n  *********************************************");
    console.log("  *             Add New Product               *");
    console.log("  *********************************************\n\n");

    // prompt user for new product info
    inquirer
        .prompt([
            {
                name: "newItem",
                type: "input",
                message: "Enter the name of the new product:",

            },
            {
                name: "newDepartment",
                type: "list",
                message: "Select the Department for the new product:",
                choices: ["Clothing", "Grocery", "Outdoors", "Other"]
            },
            {
                name: "newPrice",
                type: "input",
                message: "Enter a price for the new product:",
                // input should be a valid price > 0
                validate: function validateItem(value) {
                    if (!isNaN(value) && (value > 0)) {
                        return true;
                    }
                    else {
                        console.log("\n   Please enter a valid price.");
                        return false;
                    }
                }
            },
            {
                name: "newQTY",
                type: "input",
                message: "Enter the Quantity for the new product:",
                // input should be a valid quantity > 0
                validate: function validateItem(value) {
                    if (!isNaN(value) && (value > 0)) {
                        return true;
                    }
                    else {
                        console.log("\n   Please enter a valid quantity");
                        return false;
                    }
                }
            },
            {
                name: "newSales",
                type: "input",
                message: "Enter the current Sales amount for the new product:",
                // input should be a valid quantity > 0
                validate: function validateItem(value) {
                    if (!isNaN(value) && (value > 0)) {
                        return true;
                    }
                    else {
                        console.log("\n   Please enter a valid Sales amount");
                        return false;
                    }
                }
            }
        ])
        .then(function (response) {
            var newProduct = response.newItem;
            var newDept = response.newDepartment;
            var decPrice = parseFloat(response.newPrice).toFixed(2);
            var newStockQTY = parseInt(response.newQTY);
            var newSales = parseFloat(response.newSales).toFixed(2);

            // insert the product into the products table
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: newProduct,
                    department_name: newDept,
                    price: decPrice,
                    stock_quantity: newStockQTY,
                    product_sales: newSales
                },
                function (error) {
                    if (error) throw err;

                    console.log("\n  ********************************************************");
                    console.log("     " + newProduct + " added successfully!");
                    console.log("  ********************************************************\n\n")

                    // ask user if they want to continue 
                    continueProgram();
                })
        })
}


