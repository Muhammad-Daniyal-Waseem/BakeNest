CREATE DATABASE defaultdb;
GO

USE defaultdb;
GO

CREATE TABLE Admin (
  ID INT NOT NULL IDENTITY,
  Email VARCHAR(50) NOT NULL,
  Password VARCHAR(50) NOT NULL,
  AccountNumber VARCHAR(20) NOT NULL,
  PRIMARY KEY (ID)
);
GO

CREATE TABLE Product (
  ID INT NOT NULL IDENTITY,
  Name VARCHAR(50) NOT NULL,
  Description TEXT NOT NULL,
  Price INT NOT NULL,
  Rating FLOAT DEFAULT NULL,
  Quantity INT DEFAULT NULL,
  Image VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (ID)
);
GO
INSERT INTO Product (Name, Description, Price, Rating, Quantity, Image) 
VALUES 
('Croissant','Flaky and buttery French croissant',120,4.88889,18,'/images/1714823535874-Croissants.jpg'),
('Baguette','Classic French baguette',80,4.875,30,'/images/1714823749258-baguette.jpeg'),
('Sourdough Bread','Artisanal sourdough loaf',150,4.625,25,'/images/1714824035851-sourdough-bread.webp'),
('Cinnamon Roll','Soft and gooey cinnamon roll',100,4.6,35,'/images/1714824146537-cinamon-roll.webp'),
('Chocolate Chip Cookies','Homemade chocolate chip cookies',50,3,40,'/images/1714824365324-CHOCOLATE-CHIP-COOKIES.jpg'),
('Red Velvet Cake','Decadent red velvet cake with cream cheese frosting',250,4.9,0,'/images/1714824627431-Red-Velvet-cake.jpg'),
('Apple Pie','Classic apple pie with a flaky crust',200,2.4625,20,'/images/1714824795935-Apple-pie.webp'),
('Danish Pastry','Light and flaky pastry filled with fruit or custard',120,5,25,'/images/1714824867896-danish-pastries.jpg'),
('Blueberry Muffins','Moist muffins bursting with fresh blueberries',80,3.16667,30,'/images/1714824981004-blueberry-muffins.jpg'),
('Pain au Chocolat','Flaky pastry with a chocolate filling',150,4.75,25,'/images/1715100965362-Pain_au_chocolat.jpg'),
('Coffee Cake','Moist cake with a crumbly cinnamon topping, perfect with coffee',200,4,909999,'/images/1715100456712-coffee-cake.jpg'),
('Lemon Tart','Tangy lemon filling in a buttery pastry shell',110,1.66687,38,'/images/1715100840550-Lemon-Tart.jpg'),
('Carrot Cake','Moist cake with grated carrots, nuts, and cream cheese frosting',900,4,15,'/images/1715101009414-carrot-cake.jpg'),
('French Macarons','Colorful and delicate almond meringue cookies',200,5,20,'/images/1715101176899-french-macaron.jpg'),
('Chocolate Chip Cookie','Soft and chewy cookie loaded with chocolate chips',80,5,50,'/images/1715155173217-CHOCOLATE-CHIP-COOKIES.jpg'),
('Red Velvet Cake','Rich and moist cake with cream cheese frosting',250,4.9,15,'/images/1715155187713-Red-Velvet-cake.jpg'),
('Almond Croissant','Croissant filled with almond paste and topped with sliced almonds',180,4.7,25,'/images/1715245276107-almond-croissant.webp'),
('Banana Bread','Homemade loaf with ripe bananas and walnuts',150,4.5,30,'/images/catto.jpg'),
('Raspberry Danish','Flaky pastry filled with raspberry jam and cream cheese',160,4.8,35,'/images/catto.jpg'),
('Apple Pie','Classic pie filled with cinnamon-spiced apples',200,4.6,20,'/images/catto.jpg'),
('Pumpkin Spice Muffin','Moist muffin with pumpkin puree and warm spices',130,4.7,28,'/images/catto.jpg'),
('Hazelnut Brownie','Fudgy brownie with chopped hazelnuts',120,4.5,40,'/images/catto.jpg'),
('Cherry Pie','Pie filled with sweet cherries and flaky crust',180,4.8,22,'/images/catto.jpg'),
('Lemon Poppy Seed Muffin','Muffin with bright lemon flavor and crunchy poppy seeds',140,4.6,35,'/images/catto.jpg'),
('Coconut Macaroon','Chewy coconut cookie with crispy exterior',90,4.3,45,'/images/catto.jpg'),
('Strawberry Shortcake','Layered cake with fresh strawberries and whipped cream',220,4.9,20,'/images/catto.jpg'),
('Peanut Butter Cookie','Classic cookie with peanut butter flavor',150,4.4,50,'/images/1715099691599-peanut-butter-cookies.jpg'),
('Carrot Cake','Moist cake with shredded carrots and cream cheese frosting',240,4.8,15,'/images/1715155238353-carrot-cake.jpg'),
('Blueberry Scone','Buttery scone filled with juicy blueberries',110,4.5,40,'/images/catto.jpg'),
('Chocolate Eclair','Pastry filled with chocolate cream and topped with chocolate icing',170,4.7,30,'/images/catto.jpg'),
('Raspberry Lemonade Cake','Cake with layers of raspberry and lemon flavors',260,4.9,10,'/images/catto.jpg'),
('Pistachio Macaron','Delicate almond meringue cookie filled with pistachio cream',110,4.6,35,'/images/catto.jpg'),
('Oatmeal Raisin Cookie','Cookie with oats and plump raisins',86,4.3,45,'/images/catto.jpg');

CREATE TABLE [User] (
  ID INT NOT NULL IDENTITY,
  Name VARCHAR(100) DEFAULT NULL,
  Email VARCHAR(100) DEFAULT NULL,
  Password VARCHAR(100) DEFAULT NULL,
  Address VARCHAR(300) DEFAULT NULL,
  Contact VARCHAR(11) DEFAULT NULL,
  Admin TINYINT DEFAULT NULL,
  PRIMARY KEY (ID),
  CONSTRAINT Unique_Email UNIQUE (Email)
);
GO

INSERT INTO [User] (Name, Email, Password, Address, Contact, Admin) 
VALUES 
('Umar','umar@gmail.com','123456789','Planet Mars Al Asim Gardens Vigo Street','03264688250',0),
('Customer 1','customer1@example.com','password1','Address 1','1234567890',0),
('Customer 2','customer2@example.com','password2','Address 2','2345678901',0),
('Customer 3','customer3@example.com','password3','Address 3','3456789012',0),
('Customer 4','customer4@example.com','password4','Address 4','4567890123',0),
('Customer 5','customer5@example.com','password5','Address 5','5678901234',0),
('Customer 6','customer6@example.com','password6','Address 6','6789012345',0),
('Customer 7','customer7@example.com','password7','Address 7','7890123456',0),
('Customer 8','customer8@example.com','password8','Address 8','8901234567',0),
('Customer 9','customer9@example.com','password9','Address 9','9012345678',0),
('Customer 10','customer10@example.com','password10','Address 10','0123456789',0),
('Admin','admin@example.com','adminpassword','Admin Address','1234567890',1),
('Muhammad Umar','mu8494759@gmail.com','$2b$10$c.8rcmRPoAgfArJj4dVqouUI.Eu3hXDuDj6tw00FAeFqBCXccBaGW','Lahore','03214911230',0),
('Ahmed Ali','ahmedAli@gmail.com','$2b$10$rlx1Cw6sRzHmHQmI.SFeWO8maTewo3rw2Sx3CzJyolTt.CTvaQW8G','House no 9 A Block Gopal Nagar Lahore','03254844127',0),
('Abu Bakar Ali','aba@gmail.com','$2b$10$ySmHd/NqAjHZZ64g1ynwYe91xDWZ8u7Vw5jh1ukJl2zb2kKvVop/.','Shahi Qila Lahore','03254844127',0),
('Shah Manzail','sm@email.com','$2b$10$isjQQsIU6aLH.EXiO8fyXu5cd6slD44u/7aVossJanYsMjOuqVcES','Okara Street Shadab Garden Block A','03214424342',0),
('Muhammad Umar','mu8494799@gmail.com','$2b$10$7fkJcfhw.uLgesDsPU98qOAasQ9x3npn09OXFXPcfa3rGrU/VmJtW','Lahore','03254844127',0),
('Muhammad Umar','mum8494799@gmail.com','$2b$10$kVvR6uEFcy/5e3n0xOwSYOvjq9EPXhTmkRuFD9X4PMUG5iQkKH9QO','Lahore','03254844127',0),
('Muhammad Umar','mam8494799@gmail.com','$2b$10$taVZi7ttNLJC6FCNcrWdH.4yc75AREBkZGJW8q1p617UubYhqWyBu','Lahore','03254844127',0),
('Dani','d@gmail.com','$2b$10$ilWndTwdnAFNg7S9tC96IuDOYod44p1iDSU8wnpjnqa3hr8MRsv8G','xyz','0978979797',0);

CREATE TABLE Cart (
  CustomerId INT NOT NULL,
  ProductId INT NOT NULL,
  Quantity INT DEFAULT 0,
  PRIMARY KEY (CustomerId, ProductId),
  FOREIGN KEY (ProductId) REFERENCES Product(ID)
);
GO

INSERT INTO Cart VALUES (1, 25, 3),(1, 30, 4),(1, 31, 2),(21, 10, 1),(22, 1, 1),(22, 2, 1);
GO



CREATE TABLE Orders (
  ID INT NOT NULL IDENTITY,
  ProductId INT DEFAULT NULL,
  Status VARCHAR(10) DEFAULT NULL,
  CustomerId INT DEFAULT NULL,
  Date DATE DEFAULT NULL,
  Review INT DEFAULT NULL,
  Quantity INT DEFAULT NULL,
  TotalBill INT DEFAULT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (ProductId) REFERENCES Product(ID),
  FOREIGN KEY (CustomerId) REFERENCES [User](ID)
);
GO