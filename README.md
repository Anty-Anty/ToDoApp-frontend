# ToDoApp – Frontend

ToDoApp is a full-stack web application for managing personal tasks, featuring user authentication, protected routes, and persistent data storage.

Frontend: React  
Backend: Node.js + Express + MongoDB

Backend repository:
https://github.com/Anty-Anty/ToDoApp-backend

## Live demo:
https://todoappoo.netlify.app/

<!-- ⚠️ Cold start notice
The backend is hosted on Render’s free tier.
Initial requests may take up to ~60 seconds due to server cold start. -->

### Demo Login & Authentication
This app requires authentication.
Reviewers can quickly create an account using a test email.
No email verification is required.

To explore the app without creating an account, use the demo credentials:

`Email: test1@test.com` 
`Password: 111111`

## Tech Stack

- React (Vite)
- React Router
- Context API
- Custom Hooks:
    - useHttpClient
    - useForm
- REST API integration
- JWT authentication
- CSS / Custom UI components
    - ErrorModal
    - LoadingSpinner
    - Input / Button components

## Why I Built This

I created this app to practice real production-style React architecture, focusing on:
- Authentication flows
- Protected routing
- User-specific content
- Persistent sessions
- Reliable syncing between frontend state and backend data

The goal was correctness, structure, and clarity — not visual complexity.

## Key Technical Decisions
<details>

### 1. Authentication & Authorization
- Implemented JWT-based authentication
- Tokens stored in localStorage for session persistence
- Auto-login on page refresh using stored credentials
- Centralized auth logic via React Context

### 2. Routing Strategy
- Public and protected routes using React Router
- User-specific routes (`/:uid/list`, `/:uid/settings`)
- Automatic redirects for unauthorized access
- Clean separation between logged-in and logged-out route trees

### 3. Code Splitting & Performance
- Lazy-loaded main pages using `React.lazy` and `Suspense`
- Loading spinners during async page loads
- Reduced initial bundle size

### 4. State Management
- Local UI state synchronized with backend responses
- Optimistic UI updates for create, update, and delete actions
- Avoids unnecessary refetching and scroll resets

### 5. Reusable Architecture

- `useHttpClient` for centralized API communication, loading, and error handling
- `useForm` for scalable form validation and input management
- Modular UI components (Modal, ErrorModal, LoadingSpinner)

</details>

## Features
### ✅ Authentication
- User signup and login
- Persistent sessions with auto-login
- Logout with token cleanup

### 📝 To-Do Management
- Create new to-do items
- Edit existing items
- Delete items with confirmation modal
- Instant UI updates after actions

### 🎨 User Customization
- User-specific title color
- Dynamically fetched from backend

### 🛡 Error & Loading Handling
- Global error modal for API failures
- Loading indicators for async actions
- Graceful fallback states

## Screenshots

### Welcome / Landing page
![Landing](public/screenshots/landing.webp)

### Authentication page
![Authentication](public/screenshots/auth.webp)

### To-Do list
![To Do List](public/screenshots/list.webp)

### Add Item form
![Add Item](public/screenshots/add_item.webp)

### Edit modal
![Edit Item](public/screenshots/edit_item.webp)

### Mobile View / User settings
![Mobile View](public/screenshots/mobile.webp) 