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

-- add a new column to the products table
Use bamazon;
ALTER Table products
ADD COLUMN product_sales decimal(10,2) NOT NULL Default 6000 AFTER stock_quantity;


USE bamazon;
select * from products


-- insert initial data into the products table
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
        
--delete from bamazon.products where item_id = 13

update bamazon.products set product_sales = 6000 where item_id = 12

USE bamazon;
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,		
  department_name VARCHAR(50) NOT NULL,		
  over_head_costs decimal(10,2) NOT NULL,				
  primary key (department_id)
);

insert into bamazon.departments (department_name, over_head_costs)
Values 	("Clothing",1500),
		("Grocery", 2000),
        ("Outdoors", 2500),
        ("Other", 3000)
        
select * from bamazon.departments

select * from departments as d
inner join products as p on
d.department_name = p.department_name


-- query for supervisor view - cost, sales, profit
SELECT d.department_id, d.department_name, d.over_head_costs, Table2.total_sales, 
		(Table2.total_sales - d.over_head_costs) as total_profit
FROM departments as d join 
(
    SELECT department_name, SUM(product_sales) as total_sales
    FROM products
    GROUP BY department_name
) Table2 on d.department_name = Table2.department_name

        