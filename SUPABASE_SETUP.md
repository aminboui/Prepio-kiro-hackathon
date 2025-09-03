# Supabase Setup Guide for Prepio

This guide will help you set up optional progress tracking for Prepio using Supabase.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `prepio` (or any name you prefer)
   - **Database Password**: Generate a secure password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually 1-2 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (the `anon` key, not the `service_role` key)

### 3. Set Up Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" message

## 🗄️ Database Schema Overview

The schema creates two main tables:

### `users` Table
- Tracks user sessions and overall statistics
- Stores preferences (language, skill level, challenge type)
- Automatically calculates success rates and average scores

### `challenges` Table
- Records every challenge attempt
- Stores original code, user solutions, and feedback
- Tracks time spent and completion status

### Functions & Triggers
- **`update_user_stats()`**: Automatically updates user statistics when challenges are completed
- **`get_user_progress()`**: Retrieves comprehensive progress data for the dashboard

## 🔐 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Anonymous Sessions**: No personal information required
- **Secure Policies**: Database policies prevent unauthorized access

## 🎯 Features Enabled

Once set up, users will see:

1. **Progress Button**: Appears in the challenge interface
2. **Analytics Dashboard**: Shows comprehensive statistics
3. **Challenge History**: Complete record of attempts
4. **Performance Insights**: Success rates and improvement trends

## 🧪 Testing the Setup

1. Start your Prepio application
2. Complete a coding challenge
3. Click the "Progress" button in the challenge interface
4. You should see your statistics and challenge history

## 🔧 Troubleshooting

### "Progress tracking unavailable" in console
- Check that your environment variables are set correctly
- Verify your Supabase project is active
- Ensure the SQL schema was executed successfully

### Progress button doesn't appear
- Make sure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart your development server after adding environment variables

### Database errors
- Check the Supabase logs in your dashboard under **Logs** → **Database**
- Verify the SQL schema was executed without errors
- Ensure RLS policies are enabled

## 📊 Sample Queries

You can run these in the Supabase SQL Editor to explore your data:

```sql
-- View all users and their stats
SELECT * FROM users;

-- View recent challenges
SELECT * FROM challenges ORDER BY created_at DESC LIMIT 10;

-- Get user progress for a specific session
SELECT * FROM get_user_progress('your_session_id_here');

-- View success rates by language
SELECT 
  language,
  COUNT(*) as total_challenges,
  COUNT(*) FILTER (WHERE is_correct = true) as correct_challenges,
  ROUND(
    (COUNT(*) FILTER (WHERE is_correct = true)::decimal / COUNT(*)::decimal) * 100, 
    2
  ) as success_rate
FROM challenges 
WHERE is_completed = true 
GROUP BY language;
```

## 🚀 Production Deployment

For production deployment:

1. Set the same environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Consider upgrading your Supabase plan for higher usage limits
3. Monitor your database usage in the Supabase dashboard
4. Set up database backups if needed

## 💡 Optional Enhancements

You can extend the schema to add:
- User authentication (if you want registered users)
- Challenge ratings and reviews
- Leaderboards and competitions
- Team/organization features
- Export functionality for user data

---

**Note**: Progress tracking is completely optional. Prepio works perfectly without Supabase - users just won't see the progress tracking features.
