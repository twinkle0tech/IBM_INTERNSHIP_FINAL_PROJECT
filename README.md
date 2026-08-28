# 📚 Study Planner

A full-stack **MERN-style Study Planner web application** designed to
help students organize their academic life in one place.

The project combines a **React + Vite frontend**, an **Express + Node.js
backend**, and **MongoDB/Mongoose** for persistent data storage. It
includes authentication, courses/subjects, chapters, schedules,
assignments, todo tasks, exams, dashboard summaries, study activity, and
profile settings.

------------------------------------------------------------------------

## UI
<img width="1910" height="900" alt="Screenshot 2026-08-28 214731" src="https://github.com/user-attachments/assets/ca1376b6-1731-4885-93e5-c1ba815ef5aa" />
<img width="1900" height="897" alt="Screenshot 2026-08-28 214719" src="https://github.com/user-attachments/assets/0e2af935-854e-4280-a79d-ec41ac855af1" />
<img width="1313" height="778" alt="Screenshot 2026-08-28 214744" src="https://github.com/user-attachments/assets/86a8bd2d-dba0-43ab-adb1-b1ed40022451" />


## 1. 🎯 Project Purpose

The main goal of this project is to give students a single dashboard
where they can:

-   Plan what they need to study.
-   Organize subjects and chapters.
-   Create and manage study schedules.
-   Track assignments and deadlines.
-   Maintain a prioritized todo list.
-   Record upcoming exams and monitor exam status.
-   See important academic information from the home dashboard.
-   Track study activity by day.
-   Manage their profile information and profile image.
-   Keep user data separated through authenticated accounts.

------------------------------------------------------------------------

# 2. ✨ Main Features

## 🔐 User Authentication

The application provides a complete registration and login flow.

### Registration

A new user can create an account using:

-   Name
-   Email
-   Password

The backend validates the registration request, hashes the password
using `bcryptjs`, stores the user in MongoDB, and returns an
authentication token.

### Login

Existing users can log in with:

-   Email
-   Password

After successful login, the application stores the JWT token and user
information in browser `localStorage`.

### Session Checking

When the application starts:

1.  It checks whether a JWT token exists.
2.  If a token exists, it calls `/api/auth/profile`.
3.  The backend verifies the token.
4.  The current user profile is returned.
5.  The dashboard is displayed.
6.  If the token is invalid or expired, the stored session is removed
    and the user is returned to Login.

### Logout

Logout removes:

-   `token`
-   `user`

from `localStorage` and returns the user to the Login page.

------------------------------------------------------------------------

# 3. 🏠 Dashboard / Home Page

The home page acts as the main overview of the student's academic
activity.

It includes:

### Hero Section

The Hero component provides the main welcome area and quick
navigation/actions.

It uses the logged-in user's information and displays personalized
content.

### Today's Schedule

Shows study sessions scheduled for the current day.

### Upcoming Assignments

Displays assignments that are coming up so the student can see
approaching deadlines.

### Top Priorities

Highlights important tasks/academic items that need attention.

### Calendar

The dashboard contains a calendar that allows the student to move
between months and see scheduled academic activity.

### Todo List Preview

The home page also provides a quick view of todo tasks.

### Exam Countdown

The dashboard can show the next upcoming exam and a countdown so
students know how much time remains.

### Study Activity

The dashboard includes a study activity section that represents study
time/activity across dates.

The activity information is connected to scheduled study sessions so
completed/recorded study time can be represented on the corresponding
day.

------------------------------------------------------------------------

# 4. 📚 Courses / Subjects

The Courses page is used to organize academic subjects.

A student can:

-   Create a subject.
-   Add a subject description.
-   View subjects.
-   Edit subjects.
-   Delete subjects.
-   Open a subject to see its chapters.
-   Add chapters.
-   Edit chapters.
-   Delete chapters.
-   Mark chapters as completed/incomplete.

### Subject Structure

A subject contains information such as:

-   Subject name/title
-   Description
-   Completion state
-   User who owns it
-   Chapters

### Chapter Structure

Each chapter can contain:

-   Chapter name
-   Description
-   Completion state

This makes the Courses page useful for breaking a large subject into
smaller study units.

------------------------------------------------------------------------

# 5. 🗓️ Schedule

The Schedule page allows students to create planned study sessions.

A schedule can contain:

-   Study title
-   Subject
-   Topic
-   Date
-   Start time
-   End time
-   Duration
-   Description
-   Completion status

### Schedule Operations

Students can:

-   Create a study session.
-   Edit a study session.
-   Delete a study session.
-   Mark a session as completed.
-   View schedules for a specific date.

The backend also calculates/stores the duration of study sessions.

This schedule data is important because it connects planning with the
dashboard's daily study information.

------------------------------------------------------------------------

# 6. 📝 Assignments

The Assignments page is used to manage academic assignments.

Each assignment can contain:

-   Title
-   Subject
-   Topic
-   Due date
-   Priority
-   Description
-   Completion status

### Assignment Operations

Students can:

-   Add assignments.
-   Edit assignments.
-   Delete assignments.
-   Mark assignments as completed.
-   View assignments according to their status/priority.

This allows upcoming academic work to be separated from general todo
tasks.

------------------------------------------------------------------------

# 7. ✅ Todo List

The Todo List is for smaller tasks and general things that need to be
completed.

A todo contains:

-   Task title
-   Subject/course
-   Priority
-   Completion status

Priority levels are:

-   Low
-   Medium
-   High

### Todo Operations

Students can:

-   Create a task.
-   Edit a task.
-   Delete a task.
-   Mark a task as completed.
-   Undo a completed task.
-   Organize tasks by priority/subject.

The dashboard also provides a Todo preview so important tasks are
visible without opening the Todo page.

------------------------------------------------------------------------

# 8. 🎓 Exams

The Exams page is used to manage upcoming examinations.

Each exam can contain:

-   Exam title
-   Subject
-   Date
-   Time
-   Location
-   Status
-   Notes

### Exam Status

The application supports exam status management so the student can
update the state of an exam.

### Exam Operations

Students can:

-   Add an exam.
-   Edit an exam.
-   Delete an exam.
-   Update exam status.
-   Store notes about important topics or information.

The dashboard uses exam information to show an **Exam Countdown** for
the next relevant exam.

------------------------------------------------------------------------

# 9. 👤 Profile / Settings

The Settings page allows the user to manage their account information.

The profile section supports:

-   First name
-   Last name
-   Email
-   Password
-   Profile image

Users can:

-   Edit profile information.
-   Upload/change a profile image.
-   Remove the profile image.
-   Save profile changes.
-   Cancel changes.

Profile updates are sent to the authenticated backend API.

------------------------------------------------------------------------

# 10. 🧭 Navigation

The application uses a navigation sidebar/navbar.

The main navigation sections are:

-   Home
-   Courses
-   Schedule
-   Assignments
-   Todo List
-   Exams
-   Settings

The navigation is handled inside the React application.

Instead of completely reloading the browser for every page, the app uses
the browser History API:

-   `window.history.pushState()`
-   `popstate`

This provides a lightweight client-side navigation system.

Supported paths include:

-   `/`
-   `/home`
-   `/courses`
-   `/schedule`
-   `/assignments`
-   `/todo`
-   `/todos`
-   `/exams`
-   `/settings`

------------------------------------------------------------------------

# 11. 🏗️ Project Architecture

The project is separated into two major applications:

``` text
STUDY PLANNER
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

------------------------------------------------------------------------

# 12. 💻 Frontend

The frontend is built using:

-   React
-   Vite
-   JavaScript/JSX
-   CSS

## `frontend/src/main.jsx`

This is the React entry point.

It:

1.  Imports React.
2.  Imports `createRoot`.
3.  Imports the main `App`.
4.  Loads the global CSS.
5.  Renders the application into the `root` element.

------------------------------------------------------------------------

## `frontend/src/App.jsx`

This is the main application controller.

It manages:

-   Authentication state.
-   Logged-in user.
-   Loading state.
-   Login/register switching.
-   Logout.
-   Session restoration.
-   Page navigation.
-   Rendering the correct page.

It reads the backend URL from:

``` text
VITE_API_URL
```

The application also safely reads the stored user from `localStorage`.

------------------------------------------------------------------------

# 13. 🧩 Frontend Components

## `components/Navbar.jsx`

Responsible for the main navigation.

It contains links/actions for:

-   Home
-   Courses
-   Schedule
-   Assignments
-   Todo List
-   Exams
-   Settings
-   Logout

------------------------------------------------------------------------

## `components/Hero.jsx`

Responsible for the main dashboard welcome/hero section.

It uses the current user and provides quick actions/navigation.

------------------------------------------------------------------------

## `components/ItemList.jsx`

This is one of the main dashboard data components.

It brings together information such as:

-   Today's schedule
-   Upcoming assignments
-   Top priorities
-   Calendar
-   Todo list
-   Exam countdown
-   Study activity

It communicates with the backend to retrieve the current user's academic
data.

------------------------------------------------------------------------

# 14. 📄 Frontend Pages

## `pages/Login.jsx`

Handles user login.

It sends login information to:

``` text
POST /api/auth/login
```

After successful authentication, the JWT token and user information are
stored and the dashboard is opened.

------------------------------------------------------------------------

## `pages/Register.jsx`

Handles new account creation.

It sends registration information to:

``` text
POST /api/auth/register
```

------------------------------------------------------------------------

## `pages/Courses.jsx`

Handles subjects and chapters.

It communicates with the Subject API to provide full CRUD functionality.

------------------------------------------------------------------------

## `pages/Schedule.jsx`

Handles study schedules and planned study sessions.

------------------------------------------------------------------------

## `pages/Assignments.jsx`

Handles assignment creation, editing, completion, and deletion.

------------------------------------------------------------------------

## `pages/TodoList.jsx`

Handles general todo tasks and priority management.

------------------------------------------------------------------------

## `pages/Exams.jsx`

Handles examination records and exam status.

------------------------------------------------------------------------

## `pages/Settings.jsx`

Handles profile information and profile image updates.

------------------------------------------------------------------------

## `pages/Goals.jsx`

A placeholder page for future academic goals functionality.

The current project navigation focuses on the implemented Courses,
Schedule, Assignments, Todo, Exams, and Settings features.

------------------------------------------------------------------------

## `pages/PagePlaceholder.jsx`

A reusable placeholder page for functionality that may be expanded
later.

------------------------------------------------------------------------

# 15. 🎨 Styling

The main styling is in:

``` text
frontend/src/App.css
```

The stylesheet controls the application's:

-   Layout
-   Sidebar
-   Navigation
-   Dashboard
-   Cards
-   Buttons
-   Forms
-   Modals
-   Calendar
-   Lists
-   Todo items
-   Assignment cards
-   Exam cards
-   Responsive behavior
-   Page-specific styling

`index.css` contains the basic root/global setup.

------------------------------------------------------------------------

# 16. 🗄️ Backend

The backend is built using:

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   JWT
-   bcryptjs
-   CORS
-   dotenv

The backend provides REST APIs used by the React frontend.

------------------------------------------------------------------------

# 17. 🚀 Backend Server

## `backend/server.js`

This is the main backend entry point.

It:

1.  Loads environment variables.
2.  Connects to MongoDB.
3.  Creates the Express application.
4.  Enables CORS.
5.  Enables JSON request parsing.
6.  Registers all API routes.
7.  Starts the server.

The server listens on:

``` text
process.env.PORT || 5000
```

The root endpoint:

``` text
GET /
```

returns a simple message confirming that the Study Planner API is
running.

------------------------------------------------------------------------

# 18. 🔌 Backend API Routes

## Authentication

Base URL:

``` text
/api/auth
```

Routes:

``` text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

Register and login are public.

Profile endpoints require authentication.

------------------------------------------------------------------------

## Subjects

Base URL:

``` text
/api/subjects
```

Routes:

``` text
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

### Chapters

``` text
POST   /api/subjects/:id/chapters
PUT    /api/subjects/:id/chapters/:chapterId
DELETE /api/subjects/:id/chapters/:chapterId
PATCH  /api/subjects/:id/chapters/:chapterId/toggle
```

------------------------------------------------------------------------

## Schedules

Base URL:

``` text
/api/schedules
```

Routes:

``` text
GET    /api/schedules
POST   /api/schedules
PUT    /api/schedules/:id
DELETE /api/schedules/:id
PATCH  /api/schedules/:id/toggle
```

Schedules can also be filtered by date using a query parameter such as:

``` text
/api/schedules?date=YYYY-MM-DD
```

------------------------------------------------------------------------

## Assignments

Base URL:

``` text
/api/assignments
```

Routes:

``` text
GET    /api/assignments
POST   /api/assignments
PUT    /api/assignments/:id
DELETE /api/assignments/:id
PATCH  /api/assignments/:id/toggle
```

------------------------------------------------------------------------

## Todos

Base URL:

``` text
/api/todos
```

Routes:

``` text
GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id
PATCH  /api/todos/:id/toggle
```

------------------------------------------------------------------------

## Exams

Base URL:

``` text
/api/exams
```

Routes:

``` text
GET    /api/exams
POST   /api/exams
PUT    /api/exams/:id
DELETE /api/exams/:id
PATCH  /api/exams/:id/status
```

------------------------------------------------------------------------

# 19. 🔒 Authentication & Security

The application uses **JWT (JSON Web Token)** authentication.

The flow is:

``` text
User Login
    ↓
Backend verifies credentials
    ↓
JWT token generated
    ↓
Frontend stores token
    ↓
Frontend sends token in Authorization header
    ↓
Backend auth middleware verifies token
    ↓
Request continues
```

Authenticated requests use:

``` text
Authorization: Bearer <token>
```

The backend middleware in:

``` text
backend/middleware/authMiddleware.js
```

extracts and verifies the JWT.

The authenticated user's ID is attached to the request so data can be
associated with the correct account.

------------------------------------------------------------------------

# 20. 🛡️ Password Security

Passwords are not stored as plain text.

The backend uses:

``` text
bcryptjs
```

to hash passwords before storing them in MongoDB.

During login, the entered password is compared against the stored hash.

------------------------------------------------------------------------

# 21. 🗃️ MongoDB Models

## `models/User.js`

Stores user account information:

-   Name
-   Email
-   Password
-   Profile image

------------------------------------------------------------------------

## `models/Subject.js`

Stores:

-   Subject information
-   Description
-   Completion state
-   Owner/user
-   Chapters

------------------------------------------------------------------------

## `models/Schedule.js`

Stores:

-   Schedule title
-   Subject
-   Topic
-   Date
-   Start time
-   End time
-   Duration
-   Description
-   Completion state
-   Owner/user

------------------------------------------------------------------------

## `models/Assignment.js`

Stores:

-   Assignment title
-   Subject
-   Topic
-   Due date
-   Priority
-   Description
-   Completion state
-   Owner/user

------------------------------------------------------------------------

## `models/Todo.js`

Stores:

-   Task title
-   Subject
-   Priority
-   Completion state
-   Owner/user

------------------------------------------------------------------------

## `models/Exam.js`

Stores:

-   Exam title
-   Subject
-   Date
-   Time
-   Location
-   Status
-   Notes
-   Owner/user

------------------------------------------------------------------------

# 22. 🎮 Controllers

Controllers contain the actual business logic for each feature.

## `authController.js`

Handles:

-   Registration
-   Login
-   JWT creation
-   Profile retrieval
-   Profile updates

## `subjectController.js`

Handles:

-   Get subjects
-   Create subject
-   Update subject
-   Delete subject
-   Add chapter
-   Update chapter
-   Delete chapter
-   Toggle chapter completion

## `scheduleController.js`

Handles:

-   Get schedules
-   Create schedule
-   Update schedule
-   Delete schedule
-   Toggle schedule completion
-   Duration calculation

## `assignmentController.js`

Handles:

-   Get assignments
-   Create assignment
-   Update assignment
-   Delete assignment
-   Toggle assignment completion

## `todoController.js`

Handles:

-   Get todos
-   Create todo
-   Update todo
-   Delete todo
-   Toggle todo completion

## `examController.js`

Handles:

-   Get exams
-   Create exam
-   Update exam
-   Delete exam
-   Update exam status

------------------------------------------------------------------------

# 23. 🧱 Routes vs Controllers vs Models

The backend follows a clean separation of responsibilities.

``` text
Frontend
   ↓
Routes
   ↓
Authentication Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

### Routes

Define API URLs and HTTP methods.

### Middleware

Checks authentication before protected requests.

### Controllers

Contain the application/business logic.

### Models

Define how data is structured in MongoDB.

This separation makes the project easier to maintain and extend.

------------------------------------------------------------------------

# 24. 🌐 API Communication

The React frontend uses the environment variable:

``` text
VITE_API_URL
```

For example, in development it can point to:

``` text
http://localhost:5000
```

The frontend then makes requests such as:

``` text
${VITE_API_URL}/api/assignments
```

For authenticated requests, the frontend sends the JWT token in the
Authorization header.

------------------------------------------------------------------------

# 25. 💾 Browser Local Storage

The frontend uses `localStorage` for session persistence.

Stored values include:

``` text
token
user
```

This allows the user to refresh the browser without immediately losing
the login session.

The app validates the token with the backend when it starts.

------------------------------------------------------------------------

# 26. 🧰 `examStorage.js`

The frontend contains:

``` text
frontend/src/utils/examStorage.js
```

This utility provides helper functionality related to exam information
stored/handled on the frontend.

It works alongside the main exam functionality and supports exam-related
dashboard behavior.

------------------------------------------------------------------------

# 27. 🔄 Typical Data Flow

For example, when creating an assignment:

``` text
Student fills Assignment form
          ↓
React Assignment page
          ↓
POST /api/assignments
          ↓
JWT authentication middleware
          ↓
assignmentController
          ↓
Assignment Mongoose model
          ↓
MongoDB
          ↓
Response returned to React
          ↓
React updates the assignment list
```

The same overall pattern is used for schedules, subjects, todos, and
exams.

------------------------------------------------------------------------

# 28. 📦 Dependencies

## Frontend

Main dependencies:

-   `react`
-   `react-dom`
-   `vite`
-   `@vitejs/plugin-react`
-   `oxlint`

## Backend

Main dependencies:

-   `express`
-   `mongoose`
-   `mongodb`
-   `bcryptjs`
-   `jsonwebtoken`
-   `cors`
-   `dotenv`
-   `nodemon` for development

------------------------------------------------------------------------

# 29. ⚙️ Environment Variables

## Backend

Create:

``` text
backend/.env
```

with values similar to:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### Explanation

`MONGO_URI`

Connection string for the MongoDB database.

`JWT_SECRET`

Secret key used to sign and verify JWT authentication tokens.

`PORT`

Port on which the backend server runs.

------------------------------------------------------------------------

## Frontend

Create:

``` text
frontend/.env
```

with:

``` env
VITE_API_URL=http://localhost:5000
```

For deployment, change it to the deployed backend URL.

For example:

``` env
VITE_API_URL=https://your-backend-service.onrender.com
```

Do not put secrets such as `JWT_SECRET` in the frontend.

------------------------------------------------------------------------

# 30. ▶️ Run the Project Locally

## Step 1 --- Install backend dependencies

Open a terminal:

``` bash
cd backend
npm install
```

## Step 2 --- Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

## Step 3 --- Configure MongoDB

Create `backend/.env`:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Step 4 --- Configure frontend

Create `frontend/.env`:

``` env
VITE_API_URL=http://localhost:5000
```

## Step 5 --- Start backend

``` bash
cd backend
npm run dev
```

The backend should run on:

``` text
http://localhost:5000
```

## Step 6 --- Start frontend

In another terminal:

``` bash
cd frontend
npm run dev
```

Vite will provide the local frontend address, normally:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 31. 🏭 Production Build

To create the frontend production build:

``` bash
cd frontend
npm run build
```

Vite creates the production output in:

``` text
frontend/dist
```

The `dist` folder is generated automatically during the build.

It does **not** need to exist before running:

``` bash
npm run build
```

------------------------------------------------------------------------

# 32. ☁️ Render Deployment

The project can be deployed as separate frontend and backend services.

## Backend on Render

Use:

``` text
Root Directory: backend
```

Build command:

``` text
npm install
```

Start command:

``` text
npm start
```

Environment variables:

``` text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Render provides the `PORT` environment variable automatically, and the
server uses it.

------------------------------------------------------------------------

## Frontend on Render

Use:

``` text
Root Directory: frontend
```

Build command:

``` text
npm install && npm run build
```

Publish directory:

``` text
dist
```

Frontend environment variable:

``` text
VITE_API_URL=https://your-backend-service.onrender.com
```

The frontend must point to the deployed backend rather than `localhost`.

------------------------------------------------------------------------

# 33. 🌍 CORS

The backend enables CORS so that the deployed React frontend can
communicate with the deployed API.

The backend currently allows the configured Render frontend origin.

If the frontend deployment URL changes, update the CORS origin in:

``` text
backend/server.js
```

------------------------------------------------------------------------

# 34. 🧪 Code Quality

The frontend includes Oxlint.

Run:

``` bash
npm run lint
```

The frontend package also provides:

``` bash
npm run build
```

for checking whether the production build can be generated successfully.

------------------------------------------------------------------------

# 35. 📁 Important Files at a Glance

``` text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── ItemList.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Assignments.jsx
│   │   ├── Courses.jsx
│   │   ├── Exams.jsx
│   │   ├── Goals.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Schedule.jsx
│   │   ├── Settings.jsx
│   │   └── TodoList.jsx
│   │
│   ├── utils/
│   │   └── examStorage.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
└── vite.config.js


backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── assignmentController.js
│   ├── authController.js
│   ├── examController.js
│   ├── scheduleController.js
│   ├── subjectController.js
│   └── todoController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Assignment.js
│   ├── Exam.js
│   ├── Schedule.js
│   ├── Subject.js
│   ├── Todo.js
│   └── User.js
│
├── routes/
│   ├── assignmentRoutes.js
│   ├── authRoutes.js
│   ├── examRoutes.js
│   ├── scheduleRoutes.js
│   ├── subjectRoutes.js
│   └── todoRoutes.js
│
├── server.js
└── package.json
```

------------------------------------------------------------------------

# 36. 🔁 CRUD Functionality

Most academic features follow the standard CRUD pattern.

CRUD means:

-   **Create** --- Add new data.
-   **Read** --- View saved data.
-   **Update** --- Edit existing data.
-   **Delete** --- Remove data.

The project implements CRUD for:

  Feature          Create   Read   Update   Delete   Complete/Status
  -------------- -------- ------ -------- -------- -----------------
  Subjects             ✅     ✅       ✅       ✅                ✅
  Chapters             ✅     ✅       ✅       ✅                ✅
  Schedule             ✅     ✅       ✅       ✅                ✅
  Assignments          ✅     ✅       ✅       ✅                ✅
  Todos                ✅     ✅       ✅       ✅               ---
  Exams                ✅     ✅       ✅       ✅                ✅
  User Profile        ---     ✅       ✅      ---               ---

------------------------------------------------------------------------

# 37. 👥 Multi-User Data Separation

The application associates academic records with the authenticated user.

This means a user's:

-   Subjects
-   Chapters
-   Schedules
-   Assignments
-   Todos
-   Exams
-   Profile

are connected to their account.

Protected controllers use the authenticated user's ID when reading or
modifying data.

This prevents the application from treating all users' academic
information as one shared dataset.

------------------------------------------------------------------------

# 38. 🎓 Example Student Workflow

A typical student can use the application like this:

``` text
1. Register an account
        ↓
2. Log in
        ↓
3. Add subjects/courses
        ↓
4. Add chapters inside subjects
        ↓
5. Create a weekly study schedule
        ↓
6. Add assignments and deadlines
        ↓
7. Add todo tasks with priorities
        ↓
8. Add upcoming exams
        ↓
9. Complete study sessions/tasks
        ↓
10. Check the dashboard for progress,
    upcoming work and exam countdowns
```

------------------------------------------------------------------------

# 39. 💡 Why the Project Is Useful

The project combines several common student-management tasks into one
application instead of requiring separate tools for:

-   Calendar planning
-   Assignment tracking
-   Todo management
-   Exam planning
-   Course organization
-   Study scheduling

The dashboard provides a quick overview, while the individual pages
provide detailed management.

------------------------------------------------------------------------

# 40. 🚀 Possible Future Improvements

The current project already provides the main study-planning workflow,
but it can be expanded with:

-   Academic goals and milestones.
-   Detailed study analytics.
-   Weekly/monthly reports.
-   Notifications and reminders.
-   Email reminders.
-   Calendar synchronization.
-   Recurring study sessions.
-   Search and advanced filtering.
-   Drag-and-drop scheduling.
-   Dark mode.
-   Mobile navigation improvements.
-   Password reset.
-   Email verification.
-   More detailed progress charts.
-   Study streak tracking.
-   Pomodoro/focus timer.
-   File attachments for assignments.
-   Admin/teacher accounts.

------------------------------------------------------------------------

# 41. 🧠 Technology Summary

  Layer                       Technology
  --------------------------- -------------------
  Frontend                    React
  Frontend Tooling            Vite
  Styling                     CSS
  Backend                     Node.js + Express
  Database                    MongoDB
  ODM                         Mongoose
  Authentication              JWT
  Password Hashing            bcryptjs
  API                         REST
  Environment Configuration   dotenv
  Cross-Origin Requests       CORS
  Development Server          Vite / Nodemon
  Deployment                  Render

------------------------------------------------------------------------

# 42. 📌 Project Summary

**Study Planner** is a full-stack student productivity and academic
management application.

The project demonstrates:

-   React component development.
-   Client-side application navigation.
-   REST API development.
-   Express backend architecture.
-   MongoDB database integration.
-   Mongoose schemas/models.
-   JWT authentication.
-   Password hashing.
-   Protected API routes.
-   CRUD operations.
-   User-specific data.
-   Form handling.
-   Dashboard data aggregation.
-   Calendar and study activity visualization.
-   Production frontend builds.
-   Deployment configuration.

The application is structured so that the frontend handles the user
interface and interaction, while the backend handles authentication,
validation, business logic, and database operations.

------------------------------------------------------------------------

## 👩‍💻 Project

**Study Planner --- IBM Internship Final Project**

Built as a full-stack academic planning application to help students
organize courses, study sessions, assignments, todos, and exams in one
place.
