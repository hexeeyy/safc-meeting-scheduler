Meeting Scheduler Backend
FastAPI backend for the meeting scheduler, integrated with Supabase SQL.
Setup

Create and activate a virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install dependencies:
pip install -r requirements.txt


Set up environment variables in .env:
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PORT=8000


Run the server:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload



API Endpoints

POST /meetings/create: Create a new meeting
GET /meetings/: Get all meetings for the authenticated user
PUT /meetings/{meeting_id}: Update a meeting
DELETE /meetings/{meeting_id}: Cancel a meeting

Access the API documentation at http://localhost:8000/docs.