-- Script de seed: dados iniciais para testes do sistema
-- Insere encomendas e eventos fictícios para validar funcionalidades

-- Inserção de encomendas de teste
INSERT INTO package (tracking_code, client_name, delivery_address) VALUES
('BR123456789', 'João Silva', 'Rua das Flores, 123 - São Paulo, SP'),
('BR987654321', 'Maria Santos', 'Av. Paulista, 1000 - São Paulo, SP'),
('BR456789123', 'Pedro Oliveira', 'Rua Augusta, 500 - São Paulo, SP');

-- Inserção de eventos para a primeira encomenda (fluxo completo normal)
INSERT INTO event (status, event_timestamp, tracking_code) VALUES
('OUT_FOR_DELIVERY', '2025-11-01 08:00:00', 'BR123456789'),
('IN_TRANSIT', '2025-11-01 10:30:00', 'BR123456789'),
('DELIVERED', '2025-11-01 14:45:00', 'BR123456789');

-- Inserção de eventos para a segunda encomenda (fluxo com tentativa falha)
INSERT INTO event (status, event_timestamp, tracking_code) VALUES
('OUT_FOR_DELIVERY', '2025-11-01 09:00:00', 'BR987654321'),
('IN_TRANSIT', '2025-11-01 11:00:00', 'BR987654321'),
('UNDELIVERED', '2025-11-01 15:00:00', 'BR987654321'),
('OUT_FOR_DELIVERY', '2025-11-02 08:00:00', 'BR987654321');

-- Inserção de eventos para a terceira encomenda (ainda em trânsito)
INSERT INTO event (status, event_timestamp, tracking_code) VALUES
('OUT_FOR_DELIVERY', '2025-11-02 07:00:00', 'BR456789123'),
('IN_TRANSIT', '2025-11-02 09:00:00', 'BR456789123');
