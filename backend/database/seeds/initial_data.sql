-- Insert initial services
INSERT INTO services (id, name, description, base_price, duration, vehicle_types, category, features, image_url) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Eco Refresh',
    'A swift, high-pressure foam bath followed by a spot-free rinse. Perfect for regular maintenance.',
    0.00,
    30,
    ARRAY['SEDAN', 'COUPE', 'HATCHBACK', 'SUV', 'TRUCK', 'LUXURY'],
    'basic',
    ARRAY['Snow Foam Treatment', 'Wheel & Rim Scrub', 'Towel Dry', 'Tire Dressing'],
    'images/fresh.jpg'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Aqua Glow Deluxe',
    'Our most popular choice. Combines exterior brilliance with a deep interior vacuum and sanitization.',
    300.00,
    60,
    ARRAY['SEDAN', 'COUPE', 'HATCHBACK', 'SUV', 'TRUCK', 'LUXURY'],
    'deluxe',
    ARRAY['All Basic Features', 'Spray Wax Shield', 'Deep Interior Vacuum', 'AC Vents Sanitized', 'Fragrance Mist'],
    'images/deluxe.jpg'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Executive Detail',
    'Showroom-level restoration. Includes paint decontamination and premium polymer sealant protection.',
    850.00,
    120,
    ARRAY['SEDAN', 'COUPE', 'HATCHBACK', 'SUV', 'TRUCK', 'LUXURY'],
    'premium',
    ARRAY['All Deluxe Features', 'Clay Bar Paint Prep', 'Carnauba Wax Polish', 'Engine Bay Detailing', 'Steam Upholstery Clean'],
    'images/executive.jpg'
);

-- Insert sample customer
INSERT INTO customers (id, name, email, phone, loyalty_points, total_spent) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'John Doe',
    'john@example.com',
    '+27112345678',
    50,
    1250.00
);

-- Insert sample booking
INSERT INTO bookings (id, customer_id, date, time, service_type, vehicle_type, vehicle_year, vehicle_make, vehicle_model, condition, extras, appointment_type, total_price, status, payment_method, payment_status, reference_number) VALUES
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440003',
    CURRENT_DATE + INTERVAL '7 days',
    '10:00 AM',
    'Aqua Glow Deluxe',
    'SUV',
    '2023',
    'BMW',
    'X5',
    'MODERATE',
    ARRAY['INTERIOR', 'WAX'],
    'studio',
    650.00,
    'confirmed',
    'card',
    'paid',
    'AG-20240001'
);