-- =============================================================================
-- AUTOLENDING OS - ESQUEMA DE BASE DE DATOS RELACIONAL (POSTGRESQL MULTI-TENANT)
-- Especializado para Financiadoras de Vehículos (Motos/Carros) en Venezuela
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE EMPRESAS FINANCIADORAS (TENANTS)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rif VARCHAR(20) UNIQUE NOT NULL,                       -- Ej. J-50192840-2
    legal_name VARCHAR(255) NOT NULL,                      -- Razón Social Mercantil
    commercial_name VARCHAR(255) NOT NULL,                 -- Nombre Comercial
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    logo_url TEXT,
    
    -- Parámetros de Negocio
    delivery_policy VARCHAR(50) DEFAULT 'ACCUMULATED_QUOTAS',
    required_quotas_for_delivery INT DEFAULT 3,
    minimum_down_payment_percent NUMERIC(5, 2) DEFAULT 30.00,
    default_annual_interest_rate NUMERIC(5, 2) DEFAULT 18.00,
    default_admin_fee_usd NUMERIC(10, 2) DEFAULT 50.00,
    default_gps_fee_usd NUMERIC(10, 2) DEFAULT 120.00,
    default_intt_fee_usd NUMERIC(10, 2) DEFAULT 80.00,
    default_rcv_fee_usd NUMERIC(10, 2) DEFAULT 35.00,
    
    -- Parámetros de Mora
    grace_period_days INT DEFAULT 3,
    daily_surcharge_percent NUMERIC(5, 2) DEFAULT 0.50,
    days_until_field_investigation INT DEFAULT 15,
    days_until_repossession_order INT DEFAULT 30,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE CLIENTES (B2C & B2B)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_type VARCHAR(10) DEFAULT 'B2C',
    doc_id VARCHAR(30) NOT NULL,                           -- Cédula V-..., E-... o RIF
    full_name VARCHAR(255) NOT NULL,                       -- Nombre y Apellido
    phone_primary VARCHAR(50) NOT NULL,                    -- Teléfono Principal WhatsApp
    phone_secondary VARCHAR(50),
    email VARCHAR(150),
    residential_address TEXT NOT NULL,
    work_address TEXT,
    
    -- Fiador / Aval Solidario
    guarantor_name VARCHAR(255),
    guarantor_doc_id VARCHAR(30),
    guarantor_phone VARCHAR(50),
    guarantor_address TEXT,
    
    risk_score VARCHAR(20) DEFAULT 'GREEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, doc_id)
);

-- 3. INVENTARIO DE VEHÍCULOS
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(20) NOT NULL,                     -- 'MOTO', 'CARRO'
    brand VARCHAR(100) NOT NULL,                           -- Marca (Bera, Keeway, etc.)
    model VARCHAR(100) NOT NULL,                           -- Modelo (SBR 150cc, etc.)
    year_manufacture INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    vin_chassis VARCHAR(100) UNIQUE NOT NULL,              -- Serial Carrocería
    engine_serial VARCHAR(100) NOT NULL,                   -- Serial Motor
    license_plate VARCHAR(20),                             -- Placa
    dealer_purchase_price_usd NUMERIC(12, 2) NOT NULL,     -- Precio concesionario
    retail_price_usd NUMERIC(12, 2) NOT NULL,              -- Precio Empresa
    is_price_locked BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'IN_STOCK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONTRATOS DE FINANCIAMIENTO & FICHA 360 DEL CLIENTE ACTIVO
CREATE TABLE loan_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    contract_number VARCHAR(50) UNIQUE NOT NULL,           -- N° CONTRATO
    client_id UUID NOT NULL REFERENCES clients(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Precios y Regla de Congelamiento tras Entrega
    concessionaire_price_usd NUMERIC(12, 2) NOT NULL,      -- PRECIO CONCESIONARIO
    is_dealer_price_frozen BOOLEAN DEFAULT FALSE,          -- Congelado si ya fue entregado
    company_price_usd NUMERIC(12, 2) NOT NULL,             -- PRECIO EMPRESA
    
    -- Moras
    late_fees_pending_usd NUMERIC(12, 2) DEFAULT 0.00,     -- MORA X COBRAR
    late_fees_paid_usd NUMERIC(12, 2) DEFAULT 0.00,        -- MORAS PAGADAS
    
    -- Impuestos
    iva_pending_usd NUMERIC(12, 2) DEFAULT 0.00,          -- IVA 16% X PAGAR
    iva_paid_usd NUMERIC(12, 2) DEFAULT 0.00,             -- IVA 16% PAGADAS
    igtf_pending_usd NUMERIC(12, 2) DEFAULT 0.00,         -- IGTF X PAGAR (Aplica en divisas USD)
    igtf_paid_usd NUMERIC(12, 2) DEFAULT 0.00,            -- IGTF PAGADAS
    
    -- Cuotas y Progreso
    quotas_pending_count INT NOT NULL,                     -- CUOTAS X COBRAR (Cantidad)
    quotas_pending_amount_usd NUMERIC(12, 2) NOT NULL,     -- CUOTAS X COBRAR ($ Monto)
    quotas_paid_count INT DEFAULT 0,                       -- CUOTAS PAGADAS (Cantidad)
    quotas_paid_amount_usd NUMERIC(12, 2) DEFAULT 0.00,    -- CUOTAS PAGADAS ($ Monto)
    quotas_paid_percent NUMERIC(5, 2) DEFAULT 0.00,        -- % CUOTAS PAGADAS
    
    -- Estatus Operativos Detallados
    delivery_status VARCHAR(50) DEFAULT 'PENDIENTE_INICIAL',         -- ENTREGADO (Estatus)
    refund_status VARCHAR(50) DEFAULT 'SIN_REEMBOLSO',               -- REEMBOLSO (Estatus)
    documents_status VARCHAR(50) DEFAULT 'PENDIENTE_RECEPCION',      -- DOCUMENTOS (Estatus)
    physical_invoice_status VARCHAR(50) DEFAULT 'PENDIENTE_EMISION', -- FACTURA FISICA (Estatus)
    vehicle_registration_status VARCHAR(50) DEFAULT 'NO_INICIADO',   -- REGISTRO DE VEHICULO (Estatus)
    
    -- Progreso General Consolidado
    overall_progress_percent NUMERIC(5, 2) DEFAULT 0.00,   -- PORCENTAJE DEL PROGRESO FINAL EN GENERAL
    
    -- Condiciones Financieras Base
    vehicle_down_payment_usd NUMERIC(12, 2) NOT NULL,
    admin_fee_usd NUMERIC(10, 2) NOT NULL,
    gps_setup_fee_usd NUMERIC(10, 2) NOT NULL,
    intt_fee_usd NUMERIC(10, 2) NOT NULL,
    rcv_fee_usd NUMERIC(10, 2) NOT NULL,
    total_initial_required_usd NUMERIC(12, 2) NOT NULL,
    financed_amount_usd NUMERIC(12, 2) NOT NULL,
    annual_interest_rate NUMERIC(5, 2) NOT NULL,
    payment_frequency VARCHAR(20) DEFAULT 'MONTHLY',
    total_quotas INT NOT NULL,
    total_paid_usd NUMERIC(12, 2) DEFAULT 0.00,
    total_outstanding_usd NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CRONOGRAMA / PLAN DE ABONOS
CREATE TABLE payment_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES loan_contracts(id) ON DELETE CASCADE,
    quota_number INT NOT NULL,
    due_date DATE NOT NULL,
    capital_usd NUMERIC(12, 2) NOT NULL,
    interest_usd NUMERIC(12, 2) NOT NULL,
    iva_usd NUMERIC(12, 2) DEFAULT 0.00,
    igtf_usd NUMERIC(12, 2) DEFAULT 0.00,
    late_fee_usd NUMERIC(12, 2) DEFAULT 0.00,
    total_quota_usd NUMERIC(12, 2) NOT NULL,
    
    paid_amount_usd NUMERIC(12, 2) DEFAULT 0.00,
    remaining_amount_usd NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    
    paid_at TIMESTAMP WITH TIME ZONE,
    receipt_number VARCHAR(100),
    receipt_type VARCHAR(50),
    payment_method VARCHAR(30),
    payment_reference VARCHAR(100),
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    UNIQUE(contract_id, quota_number)
);

-- 6. AUDITORÍA DE CAJA Y ARQUEO CIEGO
CREATE TABLE cash_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    cashier_user_id VARCHAR(100) NOT NULL,
    shift_date DATE NOT NULL,
    opening_balance_usd NUMERIC(12, 2) DEFAULT 0.00,
    theoretical_usd NUMERIC(12, 2) NOT NULL,
    declared_cash_usd NUMERIC(12, 2) NOT NULL,
    difference_usd NUMERIC(12, 2) NOT NULL,
    is_balanced BOOLEAN NOT NULL,
    observations TEXT,
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);