// Rhonda Johnson
// assignment 10
// Customer Mode

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

// start the Bamazon storefront
function start() {

    // query the database for all items being sold
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // display all items in the database
        console.log("\n  *********************************************");
        console.log("  *             Welcome to Bamazon            *");
        console.log("  *********************************************");
        console.log("\n      Items for Sale  ");

        // instantiate a new Table
        var table = new Table({
            head: ['Id', 'Product Name', 'Price ($)'],
        });

        for (var i = 0; i < res.length; i++) {
            var record = res[i];
            table.push([record.item_id, record.product_name, record.price]);
        }
        console.log(table.toString());

        // This will display all columns if needed
        //  // instantiate a new Table
        //  var table = new Table({
        //     head: ['Id', 'Product Name', 'Price ($)', 'Dept', 'QTY', 'Sales ($)'],
        // });

        // for (var i = 0; i < res.length; i++) {
        //     var record = res[i];
        //     table.push([record.item_id, record.product_name, record.price, record.department_name,
        //     record.stock_quantity, record.product_sales]);
        // }
        // console.log(table.toString());


        // prompt user for product ID & Quantity for purchase
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "input",
                    message: "What is the ID of the product you would like to purchase?",
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
                    message: "How many would you like to purchase?",
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
                //console.log(answer);
                // console.log(" Choice " + answer.choice + " QTY: = " + answer.qty);
                var item = parseInt(answer.choice);
                var howMany = parseInt(answer.qty);
                var cost = 0;
                var currentRecord = res[item - 1];
                //console.log(" Choice " + item + " QTY: = " + howMany);

                // check if enough quantity
                if (howMany > currentRecord.stock_quantity) {
                    //console.log("stock qty = " + currentRecord.stock_quantity);
                    console.log("\n***************************************");
                    console.log("  Your order will not be processed. \n  Insufficient quantity.");
                    console.log("***************************************\n");

                    // ask user if they want to continue shopping
                    continueShopping();
                }
                else {
                    // update table & display cost
                    connection.query(
                        "UPDATE products SET ? , ? WHERE ?",
                        [
                            {
                                stock_quantity: currentRecord.stock_quantity - howMany
                            },
                            {
                                product_sales: currentRecord.product_sales + (currentRecord.price * howMany)
                            },
                            {
                                item_id: item
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            //console.log("Quantity updated successfully!");
                            cost = currentRecord.price * howMany;
                            console.log("*************************************************************************")
                            console.log("  Thank you for your purchase of " + howMany + " " + currentRecord.product_name);
                            console.log("  Your Total Cost is  $" + parseFloat(cost).toFixed(2));
                            console.log("*************************************************************************\n\n")

                            // ask user if they want to continue shopping
                            continueShopping();
                        })
                }
            })
    })

    // ask the user if they want to continue shopping
    function continueShopping() {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Would you like to make another purchase?",
                    name: "reply",
                    default: true
                },
            ])
            .then(function (answer) {
                //console.log(answer);
                //console.log("reply = " + answer.reply);

                // restart Bamazon storefront if the user wants to make another purchase
                if (answer.reply) {
                    start();
                }
                else {
                    console.log("\n*********************************");
                    console.log("  Thank you for your business. \n  Have a good day.");
                    console.log("*********************************\n");
                    connection.end();
                }
            })
    }
}

