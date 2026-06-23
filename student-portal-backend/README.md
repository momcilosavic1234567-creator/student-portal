# student-portal

A FastAPI backend for a student portal with user authentication, student profiles, and an AI assistant endpoint.

## Setup

1. Create a Python virtual environment:

   python -m venv .venv
   .\.venv\Scripts\activate

2. Install the dependencies:

   python -m pip install -r requirements.txt

3. Create or update `.env` with the following settings:

   DATABASE_URL=postgresql://postgres:password@localhost:5432/student_portal
   SECRET_KEY=your-secret-key
   GEMINI_API_KEY=your-api-key

4. Run the app:

   uvicorn app.main:app --reload

## API

- `POST /api/v1/auth/register` - register a new user
- `POST /api/v1/auth/login` - authenticate and receive a bearer token
- `GET /api/v1/students/me` - fetch the authenticated user's student profile
- `POST /api/v1/students/` - create a student profile
- `PUT /api/v1/students/me` - update the current student's profile
- `POST /api/v1/ai/` - ask the AI assistant a question
