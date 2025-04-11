# Job Tracker API

A RESTful API for tracking job applications built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   > Note: We use port 3000 instead of 5000 because macOS Control Center uses port 5000 for AirPlay services.

3. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check

- **Health Status**: `GET /health`
  - Returns the current status of the API and database connection
  - No authentication required
  - Response example:
    ```json
    {
      "status": "UP",
      "timestamp": "2025-04-11T12:45:32.123Z",
      "uptime": 1234.56,
      "environment": "development",
      "database": "connected"
    }
    ```

### Authentication

- **Register User**: `POST /api/auth/register`
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

- **Login User**: `POST /api/auth/login`
  - Body: `{ "email": "string", "password": "string" }`

### Jobs

All job endpoints require authentication. Include the bearer token in the Authorization header.

- **Create Job**: `POST /api/jobs`
  - Body: `{ "position": "string", "company": "string", "jobLocation": "string", "status": "string", "jobType": "string" }`
  - Status options: `["pending", "interview", "declined"]`
  - JobType options: `["full-time", "part-time", "remote", "internship"]`

- **Get All Jobs**: `GET /api/jobs`

- **Update Job**: `PUT /api/jobs/:id`
  - Body: Any job fields to update

- **Delete Job**: `DELETE /api/jobs/:id`

## Using Postman

A Postman collection is provided (`Job-Tracker-API.postman_collection.json`) that you can import to test all the endpoints.

1. Register a user to get a token
2. The token will be automatically saved to the collection variables
3. Create, view, update, and delete jobs using the appropriate endpoints 

## Troubleshooting

### "403 Forbidden" Error
If you encounter a 403 Forbidden error:
1. Check if you're using the correct port (3000)
2. Verify your request headers (Content-Type: application/json)
3. Ensure the server is running (`npm start` or `npm run dev`)
4. Check logs in the `/logs` directory for more detailed error information

### Port Conflicts
If port 3000 is already in use:
1. Change the PORT value in your .env file
2. Make sure to update your Postman collection URLs to match the new port 