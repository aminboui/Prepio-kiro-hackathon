-- FixorAI Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create user_profiles table for tracking user progress
-- This extends the built-in auth.users table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_challenges INTEGER DEFAULT 0,
    correct_challenges INTEGER DEFAULT 0,
    incorrect_challenges INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    preferred_language TEXT,
    preferred_skill_level TEXT,
    preferred_challenge_type TEXT
);

-- Create challenges table for storing challenge attempts
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    challenge_type TEXT NOT NULL,
    original_code TEXT NOT NULL,
    user_solution TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    is_correct BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    correctness_score INTEGER DEFAULT 0,
    efficiency_score INTEGER DEFAULT 0,
    code_quality_score INTEGER DEFAULT 0,
    feedback TEXT,
    suggestions JSONB,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON challenges(created_at);
CREATE INDEX IF NOT EXISTS idx_challenges_language ON challenges(language);
CREATE INDEX IF NOT EXISTS idx_challenges_skill_level ON challenges(skill_level);

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user statistics when a challenge is completed
    IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
        -- Insert or update user profile
        INSERT INTO user_profiles (id, email, total_challenges, correct_challenges, incorrect_challenges, average_score, updated_at)
        VALUES (
            NEW.user_id,
            (SELECT email FROM auth.users WHERE id = NEW.user_id),
            1,
            CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
            CASE WHEN NEW.is_correct THEN 0 ELSE 1 END,
            NEW.score,
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            total_challenges = (
                SELECT COUNT(*) 
                FROM challenges 
                WHERE user_id = NEW.user_id AND is_completed = TRUE
            ),
            correct_challenges = (
                SELECT COUNT(*) 
                FROM challenges 
                WHERE user_id = NEW.user_id AND is_completed = TRUE AND is_correct = TRUE
            ),
            incorrect_challenges = (
                SELECT COUNT(*) 
                FROM challenges 
                WHERE user_id = NEW.user_id AND is_completed = TRUE AND is_correct = FALSE
            ),
            average_score = (
                SELECT COALESCE(AVG(score), 0) 
                FROM challenges 
                WHERE user_id = NEW.user_id AND is_completed = TRUE
            ),
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
    AFTER UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Create function to get user progress summary
CREATE OR REPLACE FUNCTION get_user_progress(user_uuid UUID)
RETURNS TABLE (
    total_challenges INTEGER,
    correct_challenges INTEGER,
    incorrect_challenges INTEGER,
    success_rate DECIMAL(5,2),
    average_score DECIMAL(5,2),
    challenges_by_language JSONB,
    challenges_by_skill_level JSONB,
    recent_challenges JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (
            SELECT COUNT(*)::INTEGER
            FROM challenges c1
            WHERE c1.user_id = user_uuid AND c1.is_completed = TRUE
        ) as total_challenges,
        (
            SELECT COUNT(*)::INTEGER
            FROM challenges c2
            WHERE c2.user_id = user_uuid AND c2.is_completed = TRUE AND c2.is_correct = TRUE
        ) as correct_challenges,
        (
            SELECT COUNT(*)::INTEGER
            FROM challenges c3
            WHERE c3.user_id = user_uuid AND c3.is_completed = TRUE AND c3.is_correct = FALSE
        ) as incorrect_challenges,
        (
            SELECT CASE 
                WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE is_correct = TRUE)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
                ELSE 0.00
            END
            FROM challenges c4
            WHERE c4.user_id = user_uuid AND c4.is_completed = TRUE
        ) as success_rate,
        (
            SELECT COALESCE(AVG(score), 0.00)::DECIMAL(5,2)
            FROM challenges c5
            WHERE c5.user_id = user_uuid AND c5.is_completed = TRUE
        ) as average_score,
        (
            SELECT COALESCE(jsonb_object_agg(language, count), '{}'::jsonb)
            FROM (
                SELECT language, COUNT(*) as count
                FROM challenges c6
                WHERE c6.user_id = user_uuid AND c6.is_completed = TRUE
                GROUP BY language
            ) lang_stats
        ) as challenges_by_language,
        (
            SELECT COALESCE(jsonb_object_agg(skill_level, count), '{}'::jsonb)
            FROM (
                SELECT skill_level, COUNT(*) as count
                FROM challenges c7
                WHERE c7.user_id = user_uuid AND c7.is_completed = TRUE
                GROUP BY skill_level
            ) skill_stats
        ) as challenges_by_skill_level,
        (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', c8.id,
                    'title', c8.title,
                    'language', c8.language,
                    'skill_level', c8.skill_level,
                    'score', c8.score,
                    'is_correct', c8.is_correct,
                    'completed_at', c8.completed_at
                )
                ORDER BY c8.completed_at DESC
            ), '[]'::jsonb)
            FROM challenges c8
            WHERE c8.user_id = user_uuid AND c8.is_completed = TRUE
            LIMIT 10
        ) as recent_challenges;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (users can only access their own data)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view their own challenges" ON challenges
    FOR ALL USING (auth.uid() = user_id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();