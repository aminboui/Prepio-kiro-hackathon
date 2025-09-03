import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types for our database
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  total_challenges: number;
  correct_challenges: number;
  incorrect_challenges: number;
  average_score: number;
  preferred_language?: string;
  preferred_skill_level?: string;
  preferred_challenge_type?: string;
}

export interface ChallengeRecord {
  id: string;
  user_id: string;
  challenge_id: string;
  title: string;
  description: string;
  language: string;
  skill_level: string;
  challenge_type: string;
  original_code: string;
  user_solution?: string;
  is_completed: boolean;
  is_correct: boolean;
  score: number;
  correctness_score: number;
  efficiency_score: number;
  code_quality_score: number;
  feedback?: string;
  suggestions?: string[];
  time_spent_seconds: number;
  created_at: string;
  completed_at?: string;
}

export interface UserProgress {
  total_challenges: number;
  correct_challenges: number;
  incorrect_challenges: number;
  success_rate: number;
  average_score: number;
  challenges_by_language: Record<string, number>;
  challenges_by_skill_level: Record<string, number>;
  recent_challenges: Array<{
    id: string;
    title: string;
    language: string;
    skill_level: string;
    score: number;
    is_correct: boolean;
    completed_at: string;
  }>;
}

// Get current user
export async function getCurrentUser() {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get or create user profile
export async function getOrCreateUserProfile(preferences?: {
  language?: string;
  skillLevel?: string;
  challengeType?: string;
}): Promise<UserProfile | null> {
  if (!supabase) return null;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile && !fetchError) {
      // Update preferences if provided
      if (preferences) {
        const { data: updatedProfile } = await supabase
          .from('user_profiles')
          .update({
            preferred_language: preferences.language,
            preferred_skill_level: preferences.skillLevel,
            preferred_challenge_type: preferences.challengeType,
          })
          .eq('id', user.id)
          .select()
          .single();

        return updatedProfile || existingProfile;
      }
      return existingProfile;
    }

    // Create new profile if doesn't exist
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User';

    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        preferred_language: preferences?.language,
        preferred_skill_level: preferences?.skillLevel,
        preferred_challenge_type: preferences?.challengeType,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user profile:', createError);
      // Return a minimal profile object even if database insert fails
      return {
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_challenges: 0,
        correct_challenges: 0,
        incorrect_challenges: 0,
        average_score: 0,
        preferred_language: preferences?.language,
        preferred_skill_level: preferences?.skillLevel,
        preferred_challenge_type: preferences?.challengeType,
      };
    }

    return newProfile;
  } catch (error) {
    console.error('Error in getOrCreateUserProfile:', error);
    return null;
  }
}

// Save a challenge attempt
export async function saveChallengeAttempt(
  challenge: any,
  userSolution?: string,
  feedback?: any,
  timeSpent?: number
): Promise<ChallengeRecord | null> {
  if (!supabase) return null;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const challengeRecord = {
      user_id: user.id,
      challenge_id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      language: challenge.language,
      skill_level: challenge.skillLevel,
      challenge_type: challenge.challengeType,
      original_code: challenge.code,
      user_solution: userSolution,
      is_completed: !!feedback,
      is_correct: feedback?.isCorrect || false,
      score: feedback?.score || 0,
      correctness_score: feedback?.correctness || 0,
      efficiency_score: feedback?.efficiency || 0,
      code_quality_score: feedback?.codeQuality || 0,
      feedback: feedback?.feedback,
      suggestions: feedback?.suggestions,
      time_spent_seconds: timeSpent || 0,
      completed_at: feedback ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('challenges')
      .insert(challengeRecord)
      .select()
      .single();

    if (error) {
      console.error('Error saving challenge:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveChallengeAttempt:', error);
    return null;
  }
}

// Get user progress
export async function getUserProgress(): Promise<UserProgress | null> {
  if (!supabase) return null;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .rpc('get_user_progress', { user_uuid: user.id });

    if (error) {
      console.error('Error getting user progress:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    return null;
  }
}

// Calculate user's daily streak based on actual challenge completion dates
export async function getUserStreak(): Promise<number> {
  if (!supabase) return 0;

  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    // Get all completed challenges ordered by completion date (most recent first)
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (error || !challenges || challenges.length === 0) {
      return 0;
    }

    // Convert dates to just the date part (YYYY-MM-DD) and get unique dates
    const uniqueDates = Array.from(new Set(
      challenges
        .filter(challenge => challenge.completed_at) // Extra safety check
        .map(challenge =>
          new Date(challenge.completed_at as string).toDateString()
        )
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) return 0;

    // Calculate streak starting from today
    const today = new Date();
    const todayStr = today.toDateString();
    const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString();

    let streak = 0;
    let currentDate = new Date();

    // Check if user completed a challenge today or yesterday (to be forgiving)
    const mostRecentDate = uniqueDates[0];
    if (mostRecentDate !== todayStr && mostRecentDate !== yesterdayStr) {
      return 0; // Streak is broken if no activity today or yesterday
    }

    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      const challengeDate = new Date(uniqueDates[i]);
      const expectedDate = new Date(currentDate);

      // Allow for same day or previous day
      const dayDiff = Math.floor((currentDate.getTime() - challengeDate.getTime()) / (24 * 60 * 60 * 1000));

      if (dayDiff === 0 || (dayDiff === 1 && streak === 0)) {
        // Same day or first day of streak (yesterday is acceptable)
        streak++;
        currentDate = new Date(challengeDate.getTime() - 24 * 60 * 60 * 1000); // Move to previous day
      } else if (dayDiff === 1) {
        // Consecutive day
        streak++;
        currentDate = new Date(challengeDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        // Gap in streak, stop counting
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating user streak:', error);
    return 0;
  }
}

// Update challenge with solution
export async function updateChallengeWithSolution(
  challengeId: string,
  userSolution: string,
  feedback: any,
  timeSpent: number
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('challenges')
      .update({
        user_solution: userSolution,
        is_completed: true,
        is_correct: feedback.isCorrect,
        score: feedback.score,
        correctness_score: feedback.correctness,
        efficiency_score: feedback.efficiency,
        code_quality_score: feedback.codeQuality,
        feedback: feedback.feedback,
        suggestions: feedback.suggestions,
        time_spent_seconds: timeSpent,
        completed_at: new Date().toISOString(),
      })
      .eq('id', challengeId);

    if (error) {
      console.error('Error updating challenge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateChallengeWithSolution:', error);
    return false;
  }
}