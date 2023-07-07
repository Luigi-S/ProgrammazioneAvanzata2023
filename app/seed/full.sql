CREATE DATABASE pa;
\c pa
CREATE TABLE users(
  email varchar(320) PRIMARY KEY,
  role SMALLINT NOT NULL,
  tokens REAL NOT NULL
);

CREATE TABLE feed(
  id SERIAL PRIMARY KEY,
  quantity REAL NOT NULL,
  name varchar(50) NOT NULL UNIQUE,
);

CREATE TYPE order_state AS ENUM ('CREATO', 'IN ESECUZIONE', 'FALLITO', 'COMPLETATO');

CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  state order_state NOT NULL,
  start TIMESTAMP,
  finish TIMESTAMP
);

CREATE TABLE loads(
  food INTEGER,
  CONSTRAINT fk_food
      FOREIGN KEY(food) 
	  REFERENCES feed(id)
  order INTEGER,
  CONSTRAINT fk_order
      FOREIGN KEY(order) 
	  REFERENCES orders(id)
  PRIMARY KEY (order, food),
  index INTEGER NOT NULL,
  requested_q REAL NOT NULL,
  actual_q REAL,
  timestamp TIMESTAMP
);


-- inserimento di 2 utenti
INSERT INTO users(email, role, budget) VALUES
('user@user.com', 1, 15),
('admin@admin.com', 0, 100);