CREATE TABLE package (
  tracking_code VARCHAR(50) PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL
);

CREATE TYPE event_status AS ENUM ('OUT_FOR_DELIVERY', 'IN_TRANSIT', 'UNDELIVERED', 'DELIVERED');

CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  status event_status NOT NULL,
  event_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tracking_code VARCHAR(50) NOT NULL REFERENCES package(tracking_code) ON DELETE CASCADE
);
