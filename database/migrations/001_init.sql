-- Migration inicial: criação das tabelas principais do sistema
-- Este script cria a estrutura básica do banco de dados para o sistema de rastreamento

-- Criação da tabela de encomendas (packages)
-- Armazena informações básicas de cada encomenda cadastrada no sistema
CREATE TABLE package (
  tracking_code VARCHAR(50) PRIMARY KEY,     -- Código único de rastreamento (chave primária)
  client_name VARCHAR(100) NOT NULL,         -- Nome do cliente que receberá a encomenda
  delivery_address TEXT NOT NULL             -- Endereço completo de entrega
);

-- Criação do tipo ENUM para os status dos eventos
-- Define os possíveis estados pelos quais uma encomenda pode passar
CREATE TYPE event_status AS ENUM (
  'OUT_FOR_DELIVERY',  -- Saída para Entrega
  'IN_TRANSIT',        -- Em Trânsito
  'UNDELIVERED',       -- Não Entregue (tentativa falhou)
  'DELIVERED'          -- Entregue (status final)
);

-- Criação da tabela de eventos (tracking events)
-- Registra cada mudança de status de uma encomenda, criando uma timeline
CREATE TABLE event (
  id SERIAL PRIMARY KEY,                                    -- ID auto-incrementado
  status event_status NOT NULL,                             -- Status do evento (enum)
  event_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Data/hora do registro
  tracking_code VARCHAR(50) NOT NULL,                       -- Código da encomenda (FK)
  CONSTRAINT fk_package                                     -- Nome da constraint de FK
    FOREIGN KEY (tracking_code)                             -- Coluna que referencia
    REFERENCES package(tracking_code)                       -- Tabela e coluna referenciadas
    ON DELETE CASCADE                                       -- Remove eventos se package for deletado
);

-- Criação de índice para otimizar consultas por código de rastreio
-- Melhora performance ao buscar todos os eventos de uma encomenda específica
CREATE INDEX idx_event_tracking_code ON event(tracking_code);

-- Criação de índice composto para otimizar consultas de timeline ordenada
-- Útil para buscar eventos de uma encomenda ordenados por data/hora
CREATE INDEX idx_event_tracking_timestamp ON event(tracking_code, event_timestamp);
