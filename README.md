# Learning Platform

A full-stack e-learning platform with a Next.js client, an Express API, MongoDB persistence, JWT authentication, instructor course management, student enrollment, and optional OpenAI course recommendations.

## Features

- Student and instructor registration and login
- Browse course listings and view course details
- Enroll in courses and view enrolled courses
- Instructor course creation, editing, and deletion
- Protected API routes using JSON Web Tokens
- AI-powered course recommendations when OpenAI is configured
- API health check at `/api/health`

## Tech Stack

- **Frontend:** Next.js, React, Fetch API
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcryptjs
- **AI integration:** OpenAI API

## Prerequisites

Install the following before starting:

- Node.js 18.18 or newer
- npm
- A MongoDB database, either MongoDB Atlas or a local MongoDB instance
- An OpenAI API key if you want to use AI recommendations

Check your installed versions:

```bash
node --version
npm --version
```

## Project Structure

```text
learning-platform/
├── client/                 # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # Shared React components
│   └── lib/api.js          # API client and session helpers
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication and role checks
│   ├── models/             # Mongoose models
│   ├── routes/             # API route definitions
│   └── server.js           # API entry point
└── README.md
```

## Installation

Clone the repository and install dependencies separately for the client and server:

```bash
git clone <repository-url>
cd learning-platform

cd server
npm install

cd ../client
npm install
```

## Environment Configuration

### Server environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learning-platform
JWT_SECRET=replace-with-a-long-random-secret
OPENAI_API_KEY=replace-with-your-openai-api-key
CLIENT_URL=http://localhost:3000
```

### Client environment

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The client defaults to this URL when the variable is not set, but defining it explicitly makes the local setup clear. Restart the Next.js development server after changing environment variables.

### Security notes

- Never commit `.env`, `.env.local`, database passwords, JWT secrets, or API keys.
- Use a long, unpredictable value for `JWT_SECRET`.
- Rotate any credentials that have been exposed or shared outside a secure secret manager.
- Configure MongoDB Atlas network access as narrowly as possible.

## Running the Application

Start the backend first in one terminal:

```bash
cd server
npm run dev
```

The API runs at `http://localhost:5000` by default.

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

The web application runs at `http://localhost:3000`.

Open the frontend in a browser:

```text
http://localhost:3000
```

### Production commands

Build and start the client:

```bash
cd client
npm run build
npm start
```

Start the server without file watching:

```bash
cd server
npm start
```

## API Endpoints

All API routes are prefixed with `/api`.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check API availability |
| POST | `/api/auth/signup` | No | Register a user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/courses` | No | List available courses |
| GET | `/api/courses/:id` | No | Get a course by ID |
| POST | `/api/courses` | Instructor | Create a course |
| GET | `/api/courses/instructor/my-courses` | Instructor | List the instructor's courses |
| PUT | `/api/courses/:id` | Instructor | Update a course |
| DELETE | `/api/courses/:id` | Instructor | Delete a course |
| POST | `/api/courses/:id/enroll` | Student | Enroll in a course |
| GET | `/api/students/enrolled` | Student | List enrolled courses |
| POST | `/api/gpt/recommendations` | Authenticated user | Get AI course recommendations |

Authenticated requests should include the token in the header:

```http
Authorization: Bearer <jwt-token>
```

## Verification

After starting the server, verify the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok"}
```

Then register or log in through the client and confirm that courses load from the API.

## Troubleshooting

### Server exits during startup

Confirm that `server/.env` contains both `MONGO_URI` and `JWT_SECRET`. The server will not start when either value is missing.

### MongoDB connection fails

Check that MongoDB is running, the connection string is correct, and the Atlas IP allowlist permits your current network.

### Browser reports a CORS error

Set `CLIENT_URL` in `server/.env` to the exact frontend origin, usually `http://localhost:3000`, then restart the server.

### Client cannot reach the API

Confirm that the server is running on port `5000` and that `client/.env.local` contains the correct `NEXT_PUBLIC_API_URL`.

### AI recommendations are unavailable

Confirm that `OPENAI_API_KEY` is present and valid. AI recommendations are optional and do not affect the rest of the platform.

## Available Scripts

### Client

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production Next.js server |
| `npm run lint` | Run the configured Next.js lint command |

### Server

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |