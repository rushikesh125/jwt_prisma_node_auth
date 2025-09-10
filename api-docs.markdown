# API Documentation for Authentication Routes

This document outlines the API endpoints for the JWT-based authentication system. Use these details to test the API using Postman. All routes are prefixed with `/api/auth`.

## Base URL
```
http://localhost:3000/api/auth
```

## Headers
- **Content-Type**: `application/json` (for POST requests)
- **Authorization**: `Bearer <token>` (for protected routes like `/profile`)

## Endpoints

### 1. Register
- **Method**: POST
- **Endpoint**: `/register`
- **Description**: Creates a new user account and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string", // Valid email address (e.g., "user@example.com")
    "password": "string" // At least 8 characters, must include a number, lowercase, and uppercase letter
  }
  ```
- **Example Request**:
  ```json
  {
    "email": "test@example.com",
    "password": "Password123"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cly...",
      "email": "test@example.com"
    }
  }
  ```
- **Error Responses**:
  - 400 Bad Request (validation errors):
    ```json
    {
      "errors": [
        { "path": "email", "message": "Valid email required" },
        { "path": "password", "message": "Password must be at least 8 characters long" }
      ]
    }
    ```
  - 400 Bad Request (user exists):
    ```json
    { "error": "User already exists" }
    ```
  - 500 Internal Server Error:
    ```json
    { "error": "Server error during registration" }
    ```

### 2. Login
- **Method**: POST
- **Endpoint**: `/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string", // Valid email address
    "password": "string" // User password
  }
  ```
- **Example Request**:
  ```json
  {
    "email": "test@example.com",
    "password": "Password123"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cly...",
      "email": "test@example.com"
    }
  }
  ```
- **Error Responses**:
  - 401 Unauthorized (invalid credentials):
    ```json
    { "error": "Invalid credentials" }
    ```
  - 400 Bad Request (validation errors):
    ```json
    {
      "errors": [
        { "path": "email", "message": "Valid email required" },
        { "path": "password", "message": "Password required" }
      ]
    }
    ```
  - 500 Internal Server Error:
    ```json
    { "error": "Server error during login" }
    ```

### 3. Profile
- **Method**: GET
- **Endpoint**: `/profile`
- **Description**: Retrieves the authenticated user's profile details. Requires a valid JWT token.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**: None
- **Example Request**:
  - Set `Authorization` header in Postman: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Success Response** (200 OK):
  ```json
  {
    "message": "Profile fetched successfully",
    "user": {
      "id": "cly...",
      "email": "test@example.com",
      "createdAt": "2025-09-10T18:38:00.000Z",
      "updatedAt": "2025-09-10T18:38:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 401 Unauthorized (missing token):
    ```json
    { "error": "Access token required" }
    ```
  - 403 Forbidden (invalid/expired token):
    ```json
    { "error": "Invalid or expired token" }
    ```
  - 404 Not Found (user not found):
    ```json
    { "error": "User not found" }
    ```
  - 500 Internal Server Error:
    ```json
    { "error": "Server error fetching profile" }
    ```

## Notes
- **Environment Setup**: Ensure `.env` contains `DATABASE_URL`, `JWT_SECRET`, and `PORT=3000`.
- **Prisma Setup**: Run `npx prisma generate` and `npx prisma db push` to sync the database.
- **Token Handling**: Tokens are valid for 24 hours (`expiresIn: '24h'`). Store the token from `/register` or `/login` for use in the `/profile` request.
- **Testing in Postman**:
  1. Set the base URL to `http://localhost:3000/api/auth`.
  2. Use the `Body` tab (raw, JSON) for POST requests.
  3. For `/profile`, add the `Authorization` header with the token from a successful `/register` or `/login` response.
- **Security**: Use HTTPS in production. Consider adding rate limiting for public endpoints.