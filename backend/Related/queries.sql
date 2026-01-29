show databases;

create database Ecommerce;

use ecommerce;

-- add authority to demo_user to make him able to use ecommerce app 
GRANT ALL PRIVILEGES ON ecommerce.* TO 'demo_user'@'localhost';
FLUSH PRIVILEGES;

SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
WHERE table_type = 'BASE TABLE'

use ecommerce;
select * from custom_user;
select * from orders;
select * from product;
select * from order_details;

delete from order_details where id in(1,2);


drop table custom_user;