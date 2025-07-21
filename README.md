# SAFC Meeting Scheduler

A modern, full-stack meeting scheduling application built with Next.js and Supabase. This application allows users to schedule meetings, manage availability, and coordinate with team members efficiently.

## Features

- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 📅 **Meeting Management**: Create, edit, and delete meetings
- 👥 **Attendee Management**: Invite users and manage attendance status
- ⏰ **Availability Tracking**: Set weekly availability and specific time blocks
- 🎨 **Modern UI**: Beautiful interface built with Radix UI and Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Real-time Updates**: Live updates with Supabase real-time subscriptions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth, NextAuth.js
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: Redux Toolkit, TanStack Query
- **Calendar**: React Big Calendar, React Day Picker

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safc-meeting-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL script from `database/schema.sql`
   - This will create all necessary tables and set up Row Level Security

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

The application provides a comprehensive REST API:

### Authentication
- All protected endpoints require authentication
- Uses Supabase Auth with JWT tokens

### Meetings
- `GET /api/meetings` - Get user's meetings
- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings/[id]` - Get specific meeting details
- `PUT /api/meetings/[id]` - Update meeting (organizers only)
- `DELETE /api/meetings/[id]` - Delete meeting (organizers only)

### Meeting Attendees
- `POST /api/meetings/[id]/attendees` - Add attendee to meeting
- `PUT /api/meetings/[id]/attendees` - Update attendance status

### Users
- `GET /api/users` - Get all users (for invitations)
- `GET /api/protected/settings/user` - Get current user profile
- `PUT /api/protected/settings/user` - Update user profile

### Availability
- `GET /api/availability` - Get user availability
- `POST /api/availability` - Set availability preferences

## Database Schema

The application uses the following main tables:

- **users**: User profiles and information
- **meetings**: Meeting details and metadata
- **meeting_attendees**: Meeting attendance and status
- **availability**: Weekly recurring availability
- **time_slots**: Specific date/time blocks

All tables include Row Level Security (RLS) policies for data protection.

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── (main)/         # Main application pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── schema/            # Validation schemas
```

### Key Components
- **Supabase Client**: Configured for both client and server-side usage
- **Authentication Middleware**: Protects API routes and pages
- **Database Types**: Full TypeScript support for database schema
- **API Error Handling**: Consistent error responses across all endpoints

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
