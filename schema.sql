-- Rhonda Johnson
-- to create bamazon database

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,		-- unique id for each product
  product_name VARCHAR(100) NOT NULL,		-- name of product
  department_name VARCHAR(50) NOT NULL,		
  price decimal(10,2) NOT NULL,				-- cost to customer
  stock_quantity INT default 0,				-- how much product is available in stores
  primary key (item_id)
);

USE bamazon;
select * from products

insert into bamazon.products (product_name, department_name, price, stock_quantity)
Values 	("Jeans", "Clothing", 35.00, 50),
		("Summer Dress", "Clothing", 25.00, 40),
        ("Flip-Flops", "Clothing", 15.00, 20),
        ("Diet Dr. Pepper", "Grocery", 4.00, 60),
        ("Pasta - 1 pound", "Grocery", 1.25, 100),
        ("Marinara Sauce", "Grocery", 2.50, 75),
        ("Parmesan - brick", "Grocery", 6.50, 15),
        ("Kayak", "Outdoors", 150.00, 15),
        ("Bicycle", "Outdoors", 300.00, 30),
        ("Tent", "Outdoors", 125.00, 30),
        ("Backpack", "Outdoors", 85, 25);
        