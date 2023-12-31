CREATE DATABASE pa;
\c pa
DROP TABLE IF EXISTS loads;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  email varchar(320) PRIMARY KEY,
  role SMALLINT NOT NULL,
  token REAL NOT NULL
);

CREATE TABLE foods(
  id SERIAL PRIMARY KEY,
  quantity REAL NOT NULL,
  name varchar(50) NOT NULL UNIQUE
);

CREATE TYPE order_state AS ENUM ('CREATO', 'IN ESECUZIONE', 'FALLITO', 'COMPLETATO');

CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  state order_state NOT NULL,
  start DATE,
  finish DATE
);

CREATE TABLE loads(
  foodId INTEGER,
  orderId INTEGER,
  PRIMARY KEY (orderId, foodId),
  index INTEGER NOT NULL,
  requested_q REAL NOT NULL,
  actual_q REAL,
  timestamp DATE
);

ALTER TABLE loads
ADD CONSTRAINT fk_food
FOREIGN KEY(foodId) 
REFERENCES foods(id);

ALTER TABLE loads
ADD CONSTRAINT fk_order
FOREIGN KEY(orderId) 
REFERENCES orders(id)
 ON DELETE CASCADE;


INSERT INTO users(email, role, token) VALUES
('user@user.com', 1, 15),
('no@tokens.com', 1, 0),
('admin@admin.com', 0, 100);

INSERT INTO foods(name, quantity) VALUES
('uova', 20),
('riso', 20),
('orzo', 20);

