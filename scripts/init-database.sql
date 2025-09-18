-- AgriAI Database Schema
-- This script creates the necessary tables for the AgriAI application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    farm_size VARCHAR(50),
    primary_crop VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather data cache table
CREATE TABLE IF NOT EXISTS weather_cache (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    weather_data JSONB NOT NULL,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Soil data cache table
CREATE TABLE IF NOT EXISTS soil_cache (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    soil_data JSONB NOT NULL,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Farm fields table
CREATE TABLE IF NOT EXISTS farm_fields (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    area_hectares DECIMAL(10, 2),
    soil_type VARCHAR(100),
    current_crop VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop recommendations table
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    field_id INTEGER REFERENCES farm_fields(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    suitability_score INTEGER CHECK (suitability_score >= 0 AND suitability_score <= 100),
    planting_window VARCHAR(100),
    expected_yield VARCHAR(100),
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farm tasks table
CREATE TABLE IF NOT EXISTS farm_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    field_id INTEGER REFERENCES farm_fields(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_weather_cache_location ON weather_cache(location_key);
CREATE INDEX IF NOT EXISTS idx_weather_cache_expires ON weather_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_soil_cache_location ON soil_cache(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_soil_cache_expires ON soil_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_farm_fields_user_id ON farm_fields(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user_id ON crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_tasks_user_id ON farm_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_tasks_due_date ON farm_tasks(due_date);

-- Insert sample data for demonstration
INSERT INTO users (email, name, password_hash, location, farm_size, primary_crop) 
VALUES 
    ('demo@agri.ai', 'Demo User', '$2b$10$example_hash', 'Punjab, India', 'medium', 'wheat'),
    ('farmer@example.com', 'John Farmer', '$2b$10$example_hash', 'California, USA', 'large', 'corn')
ON CONFLICT (email) DO NOTHING;

-- Insert sample farm fields
INSERT INTO farm_fields (user_id, name, latitude, longitude, area_hectares, soil_type, current_crop)
SELECT 
    u.id,
    'Field A',
    30.7333,
    76.7794,
    10.5,
    'Alluvial',
    'Wheat'
FROM users u WHERE u.email = 'demo@agri.ai'
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO farm_tasks (user_id, title, description, due_date, priority, status, category)
SELECT 
    u.id,
    'Apply pre-sowing irrigation',
    'Water the field 7 days before wheat planting',
    CURRENT_DATE + INTERVAL '5 days',
    'high',
    'pending',
    'irrigation'
FROM users u WHERE u.email = 'demo@agri.ai'
ON CONFLICT DO NOTHING;
