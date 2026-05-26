# API Collection for Postman Testing

Here is the complete list of all API routes found in the project. You can use these endpoints to test them in Postman. 
For routes containing `:battleId` or `:limit`, replace them with actual valid IDs or numbers in Postman.

---

## 🔐 Authentication & Setup Guide for Postman

**1. How to get Authorization Token (JWT)?**
- Call `POST http://localhost:5000/api/auth/login` or `POST http://localhost:5000/api/auth/register`. 
- Upon success, the server will either send a token in the response body or set a cookie named `token`.
- **To test protected APIs:** In Postman, go to the **Authorization** tab, select **Bearer Token**, and paste the token there. (Or if cookies are set, Postman will send them automatically).

**2. Where to get the Google Credential (`/api/auth/google`)?**
- This `credential` token comes from Google when a user logs in via the Google Sign-In button on your Frontend (React/Next.js).
- Google gives a JWT token. That exact token is sent in the body.
- *To test in Postman:* You either need to log in from your frontend and copy the token from the network tab, or you can temporarily bypass it in the code if needed.

**3. Where to get Reset Password Token?**
- Call `POST http://localhost:5000/api/auth/forgot-password` with your email.
- The backend will generate a reset token and (usually) email it to you or log it in the terminal.
- Copy that token and use it in `POST http://localhost:5000/api/auth/reset-password`.

---

## 1. Authentication APIs (Base: `http://localhost:5000/api/auth`)

### Register User
- **URL:** `POST http://localhost:5000/api/auth/register`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

### Login User
- **URL:** `POST http://localhost:5000/api/auth/login`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

### Logout User
- **URL:** `POST http://localhost:5000/api/auth/logout`
- **Method:** `POST`
- **Body:** None

### Forgot Password
- **URL:** `POST http://localhost:5000/api/auth/forgot-password`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com"
  }
  ```

### Reset Password
- **URL:** `POST http://localhost:5000/api/auth/reset-password`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "token": "reset_token_here",
    "password": "new_password"
  }
  ```

### Google Auth
- **URL:** `POST http://localhost:5000/api/auth/google`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "credential": "google_auth_jwt_token_from_frontend"
  }
  ```

### Check Authentication Status
- **URL:** `GET http://localhost:5000/api/auth/check-auth`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token or Cookie)
- **Body:** None

### Get Ban Status
- **URL:** `GET http://localhost:5000/api/auth/ban-status`
- **Method:** `GET`
- **Auth Required:** Yes
- **Body:** None


## 2. User APIs (Base: `http://localhost:5000/api/user`)

### Get User Profile
- **URL:** `GET http://localhost:5000/api/user/profile`
- **Method:** `GET`
- **Auth Required:** Yes
- **Body:** None

### Update User Profile
- **URL:** `PUT http://localhost:5000/api/user/update`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "username": "new_username",
    "bio": "New bio description",
    "language": "javascript",
    "github": "https://github.com/yourprofile",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "avatar": "image_url_here"
  }
  ```


## 3. Battle APIs (Base: `http://localhost:5000/api/battle`)

### Create Battle
- **URL:** `POST http://localhost:5000/api/battle/create`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "topic": "arrays",
    "difficulty": "medium"
  }
  ```

### Join Battle
- **URL:** `POST http://localhost:5000/api/battle/join/:battleId`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body:** None

### Get Battle Question
- **URL:** `GET http://localhost:5000/api/battle/:battleId/question`
- **Method:** `GET`
- **Auth Required:** Yes
- **Body:** None

### Submit Code
- **URL:** `POST http://localhost:5000/api/battle/:battleId/submit`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "code": "function solve() { return 'hello'; }",
    "language": "javascript"
  }
  ```

### Run Code
- **URL:** `POST http://localhost:5000/api/battle/:battleId/run`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "code": "console.log('Running test');",
    "language": "javascript"
  }
  ```

### Get AI Hint
- **URL:** `POST http://localhost:5000/api/battle/:battleId/hint`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "currentCode": "function solve() { return 1; }",
    "problemStatement": "Write a function that adds two numbers",
    "type": "logic" 
  }
  ```

### Report Cheat
- **URL:** `POST http://localhost:5000/api/battle/:battleId/report-cheat`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body (JSON):**
  ```json
  {
    "reason": "Unfair behavior detected"
  }
  ```


## 4. Leaderboard APIs (Base: `http://localhost:5000/api/leaderboard`)

### Get General Leaderboard
- **URL:** `GET http://localhost:5000/api/leaderboard/`
- **Method:** `GET`
- **Auth Required:** No
- **Body:** None

### Get Top Leaderboard
- **URL:** `GET http://localhost:5000/api/leaderboard/top/:limit`
- **Method:** `GET`
- **Auth Required:** No
- **Body:** None (Replace `:limit` with a number, e.g., `/api/leaderboard/top/10`)

### Get My Rank
- **URL:** `GET http://localhost:5000/api/leaderboard/me`
- **Method:** `GET`
- **Auth Required:** Yes
- **Body:** None


## 5. Execution & Testing APIs

### Execute Code directly
- **URL:** `POST http://localhost:5000/api/execute`
- **Method:** `POST`
- **Auth Required:** No
- **Body (JSON):**
  ```json
  {
    "code": "console.log('Test execution');",
    "language": "javascript"
  }
  ```

### Simple Test Route
- **URL:** `GET http://localhost:5000/test`
- **Method:** `GET`
- **Auth Required:** No
- **Body:** None
