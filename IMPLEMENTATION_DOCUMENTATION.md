# Level Up — Fix Report, Google Auth & API Testing

This document covers **issues found during re-check**, **how they were fixed**, **Google login/signup added**, and **how APIs were tested**.

---

## 1. Issues Found & Fixes

| # | Issue | Root cause | Fix |
|---|--------|------------|-----|
| 1 | Profile page showed static mock data (#342 rank, fake battles) | `ProfilePage.jsx` was reverted to old MOCK constants | Re-wired to `fetchUserProfile()` / `updateUserProfile()` with loading & error states |
| 2 | Profile edit failed / no update | Used `axios.put("/api/user/update")` + `localStorage` token; Vite proxy was disabled | Central `api.js` with `VITE_API_URL`; cookie auth via `withCredentials` |
| 3 | Dashboard stats empty / wrong | `profileService` called `/api` but proxy commented out in `vite.config.js` | All services use `http://localhost:5000/api` from `.env` |
| 4 | Login/Register validation missing | Forms reverted to old version | Restored client-side validation + server messages via `rejectWithValue` |
| 5 | Forgot password not on UI | `LoginForm` reverted | Restored `ForgotPasswordModal` on Sign In & Sign Up tabs |
| 6 | Auth errors not shown on register | `registerUser` thunk did not propagate API errors | Added `rejectWithValue` in `authSlice.jsx` |
| 7 | `displayUser` used before defined in ProfilePage | Variable order bug | Moved `displayUser` / `statsSummary` before `profileUrl` |
| 8 | Stats icons broken after dynamic switch | API returns `{ label, value }` without `icon` | Added `iconMap` keyed by label |
| 9 | API tests failed with "fetch failed" | Server not running on port 5000 | Start server first, then run `npm test` |

**Not changed:** Battle system, sockets, leaderboard logic, folder structure, cheat/ban flow.

---

## 2. New Feature — Google Sign In / Sign Up

### Backend
- **Route:** `POST /api/auth/google`
- **Body:** `{ "credential": "<Google ID token>" }`
- **Package:** `google-auth-library`
- **User model fields:** `googleId`, `authProvider` (`local` | `google`)
- **Password:** Optional when `googleId` is set (random hash stored internally)
- **Linking:** If email already exists (local account), Google ID is linked on first Google login

### Frontend
- **Package:** `@react-oauth/google`
- **Component:** `GoogleSignInButton.jsx` on Sign In & Sign Up (`Auth.jsx`)
- **Provider:** `GoogleOAuthProvider` in `main.jsx`
- **Redux:** `googleLogin` thunk in `authSlice.jsx`

### Environment variables (required for Google button to work)

**Server** `LevelUp/server/.env`:
```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

**Client** `LevelUp/client/levelUp/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Use the **same Client ID** from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client ID (Web application). Add authorized JavaScript origins: `http://localhost:5173`.

If `VITE_GOOGLE_CLIENT_ID` is empty, the UI shows a setup hint instead of the button.

---

## 3. API Endpoints Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register with validation |
| POST | `/api/auth/login` | No | Email/password login |
| POST | `/api/auth/google` | No | Google ID token login/signup |
| POST | `/api/auth/logout` | Cookie | Logout |
| POST | `/api/auth/forgot-password` | No | Request reset token |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/auth/check-auth` | Cookie | Current user |
| GET | `/api/user/profile` | Cookie | Full dynamic profile |
| PUT | `/api/user/update` | Cookie | Update profile |

---

## 4. How APIs Were Tested

### Automated (9 checks — all passed)

```bash
# Terminal 1
cd LevelUp/server
node server.js

# Terminal 2
cd LevelUp/server
npm test
```

**Script:** `LevelUp/server/scripts/testProfileAuthApi.js`

| Test | Result |
|------|--------|
| Register validation rejects bad input | ✓ |
| Register new user | ✓ |
| Login | ✓ |
| GET profile | ✓ |
| PUT profile update | ✓ |
| Forgot password | ✓ |
| Reset password | ✓ |
| Login with new password | ✓ |
| Google auth rejects missing credential | ✓ |

### Manual UI checklist

1. **Sign up** — short username / weak password → inline errors  
2. **Sign in** — wrong password → alert with server message  
3. **Forgot password** — email → dev token → reset → login  
4. **Google** — click button (with Client ID set) → dashboard  
5. **Profile** — stats/badges/activity from your account  
6. **Edit profile** — save bio, languages, socials → refreshes  
7. **Dashboard** — rank, streak, history from same profile API  

---

## 5. Files Modified in This Pass

### Added
- `client/levelUp/src/services/api.js`
- `client/levelUp/src/components/auth/GoogleSignInButton.jsx`

### Updated
- `server/src/models/User.js` — Google fields
- `server/src/controllers/authController.js` — Google auth, token helper
- `server/src/routes/authRoutes.js` — `/google` route
- `client/levelUp/src/store/auth-slice/authSlice.jsx` — shared API, Google thunk, errors
- `client/levelUp/src/services/profileService.js` — uses `api.js`
- `client/levelUp/src/components/layout/ProfilePage.jsx` — dynamic again
- `client/levelUp/src/components/auth/LoginForm.jsx` — validation + forgot password
- `client/levelUp/src/components/auth/RegisterForm.jsx` — validation + forgot password
- `client/levelUp/src/components/auth/Auth.jsx` — Google button + divider
- `client/levelUp/src/main.jsx` — GoogleOAuthProvider
- `server/scripts/testProfileAuthApi.js` — Google validation test
- `server/.env` / `client/levelUp/.env` — Google Client ID placeholders

---

## 6. Run Project

```bash
# Backend
cd LevelUp/server
npm run dev

# Frontend
cd LevelUp/client/levelUp
npm run dev
```

Open `http://localhost:5173` → Sign In / Sign Up → test email or Google flow → Profile & Dashboard.

---

*Last verified: all 9 automated API tests passed with server on port 5000 and MongoDB Atlas connected.*
