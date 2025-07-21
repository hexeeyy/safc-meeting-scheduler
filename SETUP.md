# SAFC Meeting Scheduler - Complete Setup Guide

## 🚀 Quick Setup Steps

### 1. Set Up Supabase Database

1. **Go to your Supabase project dashboard**
   - Visit [supabase.com](https://supabase.com) and sign in
   - Select your project or create a new one

2. **Run the database schema**
   - Navigate to the **SQL Editor** in your Supabase dashboard
   - Copy the entire contents of `database/schema.sql`
   - Paste it into the SQL Editor and click **Run**
   - This will create all tables, indexes, triggers, and security policies

3. **Verify tables were created**
   - Go to the **Table Editor** in Supabase
   - You should see these tables:
     - `users`
     - `meetings`
     - `meeting_attendees`
     - `availability`
     - `time_slots`

### 2. Configure Environment Variables

1. **Get your Supabase credentials**
   - In your Supabase dashboard, go to **Settings > API**
   - Copy the following values:
     - Project URL
     - anon/public key
     - service_role key

2. **Create .env.local file**
   ```bash
   # Copy the template
   cp env-template.txt .env.local
   ```

3. **Fill in your actual values in .env.local**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Generate NextAuth secret**
   ```bash
   # Run this command to generate a secure secret
   openssl rand -base64 32
   ```

### 3. Update Source Code (Remove Hardcoded Keys)

After setting up your .env.local file, the hardcoded Supabase credentials in the source code will be automatically overridden by your environment variables.

### 4. Test the Backend

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test API endpoints**
   - Open your browser to http://localhost:3000
   - Test these endpoints in your browser or with a tool like Postman:
     - `GET /api/users` - Get all users
     - `GET /api/meetings` - Get meetings (requires auth)
     - `GET /api/availability` - Get availability

### 5. Set Up Authentication

1. **Configure Supabase Auth**
   - In Supabase dashboard, go to **Authentication > Settings**
   - Configure your site URL: `http://localhost:3000`
   - Enable email authentication or other providers as needed

2. **Create your first user**
   - Go to **Authentication > Users** in Supabase
   - Click **Add User** to create a test user
   - Or use the signup functionality in your app

## 🔧 API Endpoints Reference

### Authentication Required Endpoints
- `GET /api/meetings` - Get user's meetings
- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings/[id]` - Get specific meeting
- `PUT /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Delete meeting
- `POST /api/meetings/[id]/attendees` - Add attendee
- `PUT /api/meetings/[id]/attendees` - Update attendance
- `GET /api/users` - Get all users
- `GET /api/availability` - Get availability
- `POST /api/availability` - Set availability
- `GET /api/protected/settings/user` - Get user profile
- `PUT /api/protected/settings/user` - Update user profile

### Example API Calls

**Create a meeting:**
```bash
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Team Standup",
    "description": "Daily team meeting",
    "start_time": "2024-01-15T09:00:00Z",
    "end_time": "2024-01-15T09:30:00Z",
    "meeting_type": "virtual",
    "attendees": ["user-id-1", "user-id-2"]
  }'
```

**Get meetings:**
```bash
curl -X GET "http://localhost:3000/api/meetings?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Authentication**: All sensitive endpoints require authentication
- **Data Isolation**: Users can only access their own data
- **Input Validation**: All inputs are validated before database operations

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to ensure all dependencies are installed

2. **Database connection errors**
   - Verify your Supabase credentials in .env.local
   - Check that your Supabase project is active

3. **Authentication errors**
   - Ensure your site URL is configured in Supabase Auth settings
   - Check that your JWT tokens are valid

4. **CORS errors**
   - Add your domain to allowed origins in Supabase dashboard

### Getting Help

- Check the browser console for detailed error messages
- Review the server logs in your terminal
- Verify your environment variables are loaded correctly

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] All 5 tables visible in Supabase Table Editor
- [ ] .env.local file created with correct credentials
- [ ] Development server running without errors
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] Test user created and can access the application

Your SAFC Meeting Scheduler backend is now fully configured and ready for use!
