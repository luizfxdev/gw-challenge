-- ======================== SCRIPT DDL - GW CHALLENGE ========================
-- Criação das tabelas do banco de dados PostgreSQL
-- Data: 2025-11-05
-- Versão: 1.0.0

-- ======================== TABELA: USER (Autenticação) ========================
CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================== TABELA: PACKAGE (Pacotes) ========================
CREATE TABLE IF NOT EXISTS package (
    tracking_code VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================== TABELA: EVENT (Eventos de Rastreamento) ========================
CREATE TABLE IF NOT EXISTS event (
    id BIGSERIAL PRIMARY KEY,
    event_timestamp TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    tracking_code VARCHAR(50) NOT NULL REFERENCES package(tracking_code) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================== ÍNDICES PARA PERFORMANCE ========================
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);
CREATE INDEX IF NOT EXISTS idx_package_tracking_code ON package(tracking_code);
CREATE INDEX IF NOT EXISTS idx_event_tracking_code ON event(tracking_code);
CREATE INDEX IF NOT EXISTS idx_event_timestamp ON event(event_timestamp);

-- ======================== DADOS DE TESTE ========================
-- Usuário de teste
INSERT INTO "user" (username, email, password) VALUES
('admin', 'admin@gwsistemas.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy71uFm')
ON CONFLICT DO NOTHING;

-- Pacotes de teste
INSERT INTO package (tracking_code, client_name, delivery_address) VALUES
('GWTEST0001', 'João Silva', 'Rua das Flores, 123, São Paulo, SP'),
('GWTEST0002', 'Maria Santos', 'Avenida Paulista, 1000, São Paulo, SP'),
('GWTEST0003', 'Pedro Oliveira', 'Rua Augusta, 500, São Paulo, SP')
ON CONFLICT DO NOTHING;

-- Eventos de teste
INSERT INTO event (event_timestamp, status, description, tracking_code) VALUES
('2025-11-04 18:09:15', 'IN_TRANSIT', 'Pacote saiu do centro de distribuição.', 'GWTEST0001'),
('2025-11-04 20:30:00', 'OUT_FOR_DELIVERY', 'Pacote saiu para entrega ao destinatário.', 'GWTEST0001'),
('2025-11-04 18:09:15', 'IN_TRANSIT', 'Pacote saiu do centro de distribuição.', 'GWTEST0002'),
('2025-11-04 18:09:15', 'IN_TRANSIT', 'Pacote saiu do centro de distribuição.', 'GWTEST0003')
ON CONFLICT DO NOTHING;

-- ======================== COMENTÁRIOS DAS TABELAS ========================
COMMENT ON TABLE "user" IS 'Tabela de usuários do sistema para autenticação';
COMMENT ON TABLE package IS 'Tabela de pacotes a serem rastreados';
COMMENT ON TABLE event IS 'Tabela de eventos de rastreamento dos pacotes';

COMMENT ON COLUMN "user".id IS 'ID único do usuário';
COMMENT ON COLUMN "user".username IS 'Nome de usuário para login';
COMMENT ON COLUMN "user".email IS 'E-mail do usuário';
COMMENT ON COLUMN "user".password IS 'Senha criptografada do usuário';

COMMENT ON COLUMN package.tracking_code IS 'Código único de rastreamento do pacote';
COMMENT ON COLUMN package.client_name IS 'Nome do cliente/destinatário';
COMMENT ON COLUMN package.delivery_address IS 'Endereço de entrega do pacote';

COMMENT ON COLUMN event.id IS 'ID único do evento';
COMMENT ON COLUMN event.event_timestamp IS 'Data e hora do evento';
COMMENT ON COLUMN event.status IS 'Status do pacote (IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, etc)';
COMMENT ON COLUMN event.description IS 'Descrição detalhada do evento';
COMMENT ON COLUMN event.tracking_code IS 'Referência ao pacote';
