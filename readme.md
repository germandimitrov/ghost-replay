# Project Setup Guide

## Getting Started

### 1. Client Setup (Frontend)

Navigate to the `client` directory to install dependencies and start the development server.

```bash
cd client
npm install
npm run dev
```

### 2. Server Setup (Backend)

Navigate to the `server` directory, configure your database, and start the API.

#### Database Initialization

Before running the server, ensure you have created your database instance:

- Open your database management tool (e.g., MySQL, PostgreSQL, or MongoDB).
- Create a new database matching the name specified in your environment variables.

#### Installation & Execution

```bash
cd server
npm install
npm run dev
```

---

**Note:** Ensure your backend server is running before attempting to fetch data from the client.
