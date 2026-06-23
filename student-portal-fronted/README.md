# Student Portal Frontend

A modern, dynamic web application frontend for the Student Portal, built with React and Vite. This application provides a comprehensive interface for managing students, user authentication, and includes an AI Assistant feature.

## Features

- **Authentication System**: Secure login and registration flows with protected routes.
- **Dashboard**: Main overview and quick access to various portal features.
- **Student Management**: View and manage student information efficiently.
- **User Profiles**: View and edit user details.
- **AI Assistant**: Integrated AI assistant utilizing markdown rendering for smart, formatted responses.
- **Modern UI**: Styled with sleek components and toast notifications for an interactive user experience.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Markdown Rendering**: React Markdown

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd student-portal-fronted
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the local development server, run:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/components/`: Reusable UI components (e.g., `ProtectedRoute`).
- `src/context/`: Context providers for global state management (e.g., `AuthContext`).
- `src/pages/`: Main application views (`DashboardPage`, `LoginPage`, `StudentsPage`, etc.).
- `src/api.js`: Configuration and utilities for API requests.
- `src/App.jsx`: Main application routing and structure.
