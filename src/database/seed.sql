-- =============================================================================
-- AUTOLENDING OS - DATOS INICIALES (SEED DATA VENEZUELA)
-- =============================================================================

-- 1. Insertar Tenant Principal
INSERT INTO tenants (
    id, rif, legal_name, commercial_name, address, phone,
    delivery_policy, required_quotas_for_delivery, minimum_down_payment_percent,
    default_annual_interest_rate, default_admin_fee_usd, default_gps_fee_usd,
    default_intt_fee_usd, default_rcv_fee_usd
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'J-50192840-2',
    'Inversiones AutoLending C.A.',
    'AutoLending Venezuela',
    'Av. Francisco de Miranda, Torre Cavendes, Chacao, Caracas',
    '+58 412-5558921',
    'ACCUMULATED_QUOTAS',
    3,
    30.00,
    18.00,
    50.00,
    120.00,
    80.00,
    35.00
) ON CONFLICT (rif) DO NOTHING;

-- 2. Insertar Clientes
INSERT INTO clients (
    id, tenant_id, client_type, doc_id, full_name, phone_primary,
    residential_address, guarantor_name, guarantor_doc_id, guarantor_phone
) VALUES
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B2C',
    'V-18.942.301',
    'Carlos Eduardo Mendoza',
    '+58 412-555-8921',
    'Av. Francisco de Miranda, Chacao, Caracas',
    'Elena Mendoza',
    'V-20.192.481',
    '+58 414-990-1289'
),
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B2C',
    'V-22.410.891',
    'María Valentina Rodríguez',
    '+58 414-332-9018',
    'La Candelaria, Caracas',
    'Ricardo Rodríguez',
    'V-17.482.019',
    '+58 416-221-9988'
),
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B2C',
    'V-14.890.112',
    'José Gregorio Castillo',
    '+58 424-118-4902',
    'Catia, Caracas',
    'Manuel Castillo',
    'V-12.890.111',
    '+58 412-887-1122'
),
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B2C',
    'V-19.781.002',
    'Ana Patricia Escalona',
    '+58 416-890-3312',
    'El Cafetal, Caracas',
    'Pedro Escalona',
    'V-15.891.001',
    '+58 424-901-2233'
) ON CONFLICT DO NOTHING;

-- 3. Insertar Vehículos
INSERT INTO vehicles (
    id, tenant_id, vehicle_type, brand, model, year_manufacture, color,
    vin_chassis, engine_serial, license_plate, dealer_purchase_price_usd,
    retail_price_usd, status
) VALUES
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'MOTO',
    'Bera',
    'SBR 150cc',
    2026,
    'Azul Eléctrico',
    '8B8BERA2026SBR8491',
    '162FMJ-948102',
    'AI8X92M',
    1100.00,
    1450.00,
    'DELIVERED'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'MOTO',
    'Empire Keeway',
    'EK Express 150',
    2026,
    'Rojo Escarlata',
    '8EK2026EXPRESS0092',
    '157FMI-881920',
    'EN TRÁMITE',
    1200.00,
    1550.00,
    'ASSIGNED'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'MOTO',
    'Bera',
    'Kavak 150cc',
    2026,
    'Negro Mate',
    '8B8BERA2026KVK7712',
    '162FMJ-330192',
    'AE3K81P',
    1150.00,
    1500.00,
    'DELIVERED'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'CARRO',
    'Chery',
    'Arauca 1.3L',
    2025,
    'Plata Brillante',
    '8CH2025ARAUCA4491',
    'SQR473F-90182',
    'AH729LA',
    5200.00,
    6800.00,
    'RELEASED'
) ON CONFLICT DO NOTHING;