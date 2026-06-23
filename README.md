# Student Portal

A full-stack web application for managing student profiles, built with a **React** frontend and a **FastAPI** backend. The platform features user authentication, student profile management, and an integrated **AI Assistant** powered by the Gemini API.

## Monorepo Structure

```
student-portal/
├── student-portal-fronted/   # React + Vite frontend
└── student-portal-backend/   # FastAPI + PostgreSQL backend
```

## Features

- **User Authentication**: Secure JWT-based registration and login.
- **Student Profiles**: Create, view, and update student profiles.
- **Student Directory**: Browse a list of all students in the portal.
- **AI Assistant**: Ask questions and receive AI-powered responses via the Gemini API.
- **Protected Routes**: Client-side route guards to ensure only authenticated users access private pages.
- **Responsive UI**: Modern interface with toast notifications and icon-rich components.

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icon library |
| React Hot Toast | Notifications |
| React Markdown | AI response rendering |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| SQLAlchemy 2.0 | ORM & database access |
| PostgreSQL | Relational database |
| Pydantic | Data validation & settings |
| Passlib (bcrypt) | Password hashing |
| Python-JOSE | JWT token generation |
| Uvicorn | ASGI server |
| Gemini API | AI assistant integration |

## Getting Started

### Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.10+
- **PostgreSQL** database instance

---

### 1. Backend Setup

```bash
cd student-portal-backend

# Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/student_portal
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

```bash
cd student-portal-fronted

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Login and receive a JWT token | No |
| `GET` | `/api/v1/students/me` | Get the current user's profile | Yes |
| `POST` | `/api/v1/students/` | Create a student profile | Yes |
| `PUT` | `/api/v1/students/me` | Update the current student's profile | Yes |
| `POST` | `/api/v1/ai/` | Send a question to the AI assistant | Yes |

## Further Reading

- [Frontend README](./student-portal-fronted/README.md) — detailed frontend setup and project structure.
- [Backend README](./student-portal-backend/README.md) — detailed backend setup and configuration.
