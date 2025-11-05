-- SzülőRadar PostgreSQL Schema
-- Database schema for the kid-friendly places discovery application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image_url TEXT,
    subscription_type VARCHAR(20) DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'family')),
    parent_count INTEGER DEFAULT 1 CHECK (parent_count >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_type);

-- Children table (for users' children)
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    birth_year INTEGER CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_children_user_id ON children(user_id);

-- ============================================
-- PLACES
-- ============================================

-- Place types lookup table
CREATE TABLE place_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_key VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default place types
INSERT INTO place_types (type_key, display_name, icon) VALUES
    ('kávézó', 'Kávézó', '☕'),
    ('játszóház', 'Játszóház', '🎪'),
    ('étterem', 'Étterem', '🍽️'),
    ('konditerem', 'Konditerem', '💪'),
    ('szállás', 'Szállás', '🏨');

-- Places table
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type_id UUID NOT NULL REFERENCES place_types(id),
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    address TEXT NOT NULL,
    phone VARCHAR(20),
    hours TEXT,
    description TEXT,
    maps_link TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for places
CREATE INDEX idx_places_type_id ON places(type_id);
CREATE INDEX idx_places_rating ON places(rating);
CREATE INDEX idx_places_approved ON places(is_approved);
CREATE INDEX idx_places_active ON places(is_active);
CREATE INDEX idx_places_location ON places(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search index for places
CREATE INDEX idx_places_search ON places USING gin(to_tsvector('hungarian', name || ' ' || COALESCE(description, '')));

-- Amenities lookup table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amenity_key VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default amenities
INSERT INTO amenities (amenity_key, display_name, icon) VALUES
    ('babasarok', 'Babasarok', '👶'),
    ('gyerek_gondozo', 'Gyerek gondozó', '🛡️'),
    ('jatszo_sarok', 'Játszó sarok', '🎮'),
    ('pelenkazo', 'Pelenkázó', '🧴'),
    ('magas_szek', 'Magas szék', '🪑'),
    ('parkolas', 'Parkolás', '🅿️'),
    ('kert', 'Kert', '🌳'),
    ('gyerek_menu', 'Gyerekmenü', '🍽️'),
    ('babakocsi_barat', 'Babakocsi-barát', '👶'),
    ('wifi', 'Ingyenes WiFi', '📶');

-- Place amenities junction table
CREATE TABLE place_amenities (
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (place_id, amenity_id)
);

CREATE INDEX idx_place_amenities_place ON place_amenities(place_id);
CREATE INDEX idx_place_amenities_amenity ON place_amenities(amenity_id);

-- ============================================
-- USER INTERACTIONS
-- ============================================

-- Saved places (user favorites)
CREATE TABLE saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, place_id)
);

CREATE INDEX idx_saved_places_user ON saved_places(user_id);
CREATE INDEX idx_saved_places_place ON saved_places(place_id);

-- Place ratings/reviews (if you want to track individual user ratings)
CREATE TABLE place_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    rating DECIMAL(3,2) NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, place_id)
);

CREATE INDEX idx_place_ratings_user ON place_ratings(user_id);
CREATE INDEX idx_place_ratings_place ON place_ratings(place_id);

-- ============================================
-- RECOMMENDATIONS
-- ============================================

-- User-submitted recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    place_name VARCHAR(255) NOT NULL,
    place_type_id UUID NOT NULL REFERENCES place_types(id),
    recommendation_text TEXT NOT NULL,
    maps_link TEXT,
    address TEXT,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    review_notes TEXT
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_status ON recommendations(status);
CREATE INDEX idx_recommendations_type ON recommendations(place_type_id);

-- Recommendation amenities junction table
CREATE TABLE recommendation_amenities (
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (recommendation_id, amenity_id)
);

CREATE INDEX idx_recommendation_amenities_rec ON recommendation_amenities(recommendation_id);
CREATE INDEX idx_recommendation_amenities_amenity ON recommendation_amenities(amenity_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_place_ratings_updated_at BEFORE UPDATE ON place_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate and update place rating from place_ratings
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE places
    SET rating = (
        SELECT COALESCE(AVG(rating), 0.0)
        FROM place_ratings
        WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)
    )
    WHERE id = COALESCE(NEW.place_id, OLD.place_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update place rating when ratings are added/updated/deleted
CREATE TRIGGER update_place_rating_on_insert AFTER INSERT ON place_ratings
    FOR EACH ROW EXECUTE FUNCTION update_place_rating();

CREATE TRIGGER update_place_rating_on_update AFTER UPDATE ON place_ratings
    FOR EACH ROW EXECUTE FUNCTION update_place_rating();

CREATE TRIGGER update_place_rating_on_delete AFTER DELETE ON place_ratings
    FOR EACH ROW EXECUTE FUNCTION update_place_rating();

-- ============================================
-- VIEWS
-- ============================================

-- View for places with type and amenities
CREATE OR REPLACE VIEW places_with_details AS
SELECT 
    p.id,
    p.name,
    pt.type_key,
    pt.display_name as type_display_name,
    pt.icon as type_icon,
    p.rating,
    p.address,
    p.phone,
    p.hours,
    p.description,
    p.maps_link,
    p.latitude,
    p.longitude,
    p.is_approved,
    p.is_active,
    p.created_at,
    p.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'key', a.amenity_key,
                'name', a.display_name,
                'icon', a.icon
            )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'::json
    ) as amenities
FROM places p
JOIN place_types pt ON p.type_id = pt.id
LEFT JOIN place_amenities pa ON p.id = pa.place_id
LEFT JOIN amenities a ON pa.amenity_id = a.id
WHERE p.is_active = TRUE
GROUP BY p.id, pt.id;

-- View for user saved places with details
CREATE OR REPLACE VIEW user_saved_places AS
SELECT 
    sp.id as saved_id,
    sp.user_id,
    sp.created_at as saved_at,
    p.*
FROM saved_places sp
JOIN places_with_details p ON sp.place_id = p.id;

-- View for recommendations with details
CREATE OR REPLACE VIEW recommendations_with_details AS
SELECT 
    r.id,
    r.user_id,
    r.place_name,
    pt.type_key,
    pt.display_name as type_display_name,
    pt.icon as type_icon,
    r.recommendation_text,
    r.maps_link,
    r.address,
    r.phone,
    r.status,
    r.created_at,
    r.reviewed_at,
    r.reviewed_by,
    r.review_notes,
    COALESCE(
        json_agg(
            json_build_object(
                'key', a.amenity_key,
                'name', a.display_name,
                'icon', a.icon
            )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'::json
    ) as amenities
FROM recommendations r
JOIN place_types pt ON r.place_type_id = pt.id
LEFT JOIN recommendation_amenities ra ON r.id = ra.recommendation_id
LEFT JOIN amenities a ON ra.amenity_id = a.id
GROUP BY r.id, pt.id;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- You can uncomment and modify these if you want to insert sample data

/*
-- Sample user (password should be hashed in production)
INSERT INTO users (email, password_hash, first_name, last_name, subscription_type) VALUES
    ('test@example.com', '$2b$10$example_hash_here', 'Teszt', 'Felhasználó', 'free');

-- Sample place
INSERT INTO places (name, type_id, rating, address, phone, description, is_approved) 
SELECT 
    'Családi Kávézó',
    pt.id,
    4.5,
    'Váci utca 15, Budapest',
    '+36 1 234 5678',
    'Egy barátságos kávézó, ahol a gyerekek is szívesen időznek.',
    TRUE
FROM place_types pt WHERE pt.type_key = 'kávézó';
*/

