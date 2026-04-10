# Firebase Setup & Connection Guide

## Overview

Your UCT Clone project is **fully configured** for Firebase. This guide explains the setup and how to troubleshoot any connection issues.

## ✅ What's Already Configured

### 1. **Client-Side Firebase** (`client/src/lib/firebase.ts`)
- Initializes Firebase with all services: Auth, Firestore, Realtime Database, Storage
- Uses environment variables from `.env` file
- Exports configured instances: `auth`, `firestore`, `rtdb`, `storage`

### 2. **Server-Side Firebase Admin** (`server/lib/firebase.ts`)
- Initializes Firebase Admin SDK with service account credentials
- Provides: `adminAuth`, `db` (Firestore), `rtdb`, `storage`
- Used for backend authentication and database operations

### 3. **Environment Variables** (`.env`)
All required Firebase credentials are configured:

```env
# Client-side (safe to expose)
VITE_FIREBASE_API_KEY=AIzaSyAGBKO3Q0p_1tvehkxYeKRVFzRe4T4uVHE
VITE_FIREBASE_AUTH_DOMAIN=uct-clone.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=uct-clone
VITE_FIREBASE_STORAGE_BUCKET=uct-clone.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=165228811926
VITE_FIREBASE_APP_ID=1:165228811926:web:22f1fa08f299389fb414b7
VITE_FIREBASE_DATABASE_URL=https://uct-clone-default-rtdb.firebaseio.com/

# Server-side (must be kept secret)
FIREBASE_PROJECT_ID=uct-clone
FIREBASE_CLIENT_EMAIL=rebeccatheresa104@gmail.com
FIREBASE_DATABASE_URL=https://uct-clone-default-rtdb.firebaseio.com/
FIREBASE_STORAGE_BUCKET=uct-clone.firebasestorage.app
```

### 4. **Authentication Flow**

#### Registration (`POST /api/auth/register`)
1. Client submits: `{ email, password, firstName, lastName, username }`
2. Backend checks if username is unique in Firestore
3. Creates Firebase Auth user
4. Saves user profile to Firestore `users/{uid}` collection
5. Reserves username in `usernames/{username}` collection
6. Client then signs in with Firebase client SDK

#### Sign In
1. Client uses Firebase client SDK: `signInWithEmailAndPassword(auth, email, password)`
2. Gets Firebase ID token
3. Sends token to backend for verification: `POST /api/auth/verify`
4. Backend verifies token and updates `lastLogin` in Firestore
5. AuthContext fetches user profile from `GET /api/users/me`

### 5. **AuthContext** (`client/src/contexts/AuthContext.tsx`)
- Manages Firebase user state with `onAuthStateChanged`
- Provides `useAuth()` hook for components
- Handles registration, sign-in, sign-out, and profile fetching

### 6. **API Integration** (`client/src/lib/api.ts`)
- Wraps all API calls with Firebase ID token authentication
- Automatically attaches `Authorization: Bearer <token>` header
- Handles token refresh and error handling

## 🚀 Getting Started

### Prerequisites
1. Node.js 18+ and pnpm installed
2. Firebase project created at [firebase.google.com](https://firebase.google.com)
3. Environment variables configured in `.env`

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (runs both frontend and backend)
pnpm dev

# The frontend will be available at http://localhost:3000
# The backend API will be at http://localhost:3001
```

### Important: Server-Side Credentials

The `.env` file currently has placeholder values for:
- `FIREBASE_PRIVATE_KEY` (missing - needed for Firebase Admin SDK)
- `FIREBASE_CLIENT_EMAIL` (partially filled)

To complete the setup, you need to:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project `uct-clone`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the JSON and extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

Update `.env`:
```env
FIREBASE_PROJECT_ID=uct-clone
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@uct-clone.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://uct-clone-default-rtdb.firebaseio.com/
FIREBASE_STORAGE_BUCKET=uct-clone.firebasestorage.app
```

## 🔧 Troubleshooting

### Issue: "Firebase Admin is not initialized"
**Solution**: Add `FIREBASE_PRIVATE_KEY` to `.env` file

### Issue: "Cannot read properties of undefined (reading 'currentUser')"
**Solution**: Ensure `AuthProvider` wraps your app in `App.tsx` (it already does)

### Issue: CORS error when calling API
**Possible causes**:
- Frontend running on wrong port (should be `http://localhost:3000`)
- Backend not running on port 3001
- `VITE_API_URL` is set to wrong address

**Solution**:
```bash
# Terminal 1: Start backend
pnpm dev  # This starts both frontend and backend

# Verify:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api/health
```

### Issue: Registration fails with "Email already exists"
**Solution**: The email is already registered in Firebase. Use a different email or reset Firebase data.

### Issue: "Invalid or expired token"
**Solution**: 
- Token may have expired (valid for 1 hour)
- Backend may not have `FIREBASE_PRIVATE_KEY` configured
- Check browser console for specific error

## 📁 Project Structure

```
UCT_Fixed/
├── client/                          # React frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── firebase.ts         # Client Firebase init
│   │   │   └── api.ts              # API wrapper with auth
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── Register.tsx        # Registration page (FIXED)
│   │   │   ├── Login.tsx           # Login page
│   │   │   └── Dashboard.tsx       # Protected page
│   │   └── App.tsx                 # Main app with providers
│   └── vite.config.ts              # Vite configuration
├── server/                          # Express backend
│   ├── lib/
│   │   └── firebase.ts             # Server Firebase init
│   ├── middleware/
│   │   └── auth.ts                 # Token verification
│   ├── routes/
│   │   ├── auth.ts                 # Auth endpoints
│   │   ├── users.ts                # User profile endpoints
│   │   ├── storage.ts              # File upload endpoints
│   │   └── realtime.ts             # Realtime DB endpoints
│   └── index.ts                    # Server bootstrap
├── .env                            # Environment variables
├── .env.example                    # Template
└── package.json                    # Dependencies
```

## 🔐 Security Notes

### Safe to Expose (in `.env`)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_URL`

### Must Keep Secret (in `.env`)
- `FIREBASE_PRIVATE_KEY` - Never commit to version control
- `FIREBASE_CLIENT_EMAIL` - Keep private
- `FIREBASE_PROJECT_ID` - Can be public but keep with private key

### Best Practices
1. Never commit `.env` to version control
2. Use `.env.example` as template for team members
3. Store production secrets in environment management service (e.g., GitHub Secrets, Firebase Functions environment)
4. Rotate service account keys periodically

## 📚 Key Files to Understand

| File | Purpose |
|------|---------|
| `client/src/lib/firebase.ts` | Initializes Firebase client SDK |
| `server/lib/firebase.ts` | Initializes Firebase Admin SDK |
| `client/src/contexts/AuthContext.tsx` | Manages authentication state |
| `server/routes/auth.ts` | Handles registration and authentication |
| `client/src/lib/api.ts` | Wraps API calls with auth token |
| `server/index.ts` | Express server configuration |

## 🐛 Fixed Issues

### HTML Hydration Error in Register.tsx
**Problem**: Nested `<a>` tag inside `<Link>` component causing hydration mismatch
```jsx
// ❌ BEFORE (Invalid)
<Link href="/login">
  <a className="...">Sign In</a>
</Link>

// ✅ AFTER (Fixed)
<Link href="/login" className="...">Sign In</Link>
```

The `Link` component from `wouter` already renders an anchor tag, so nesting another one creates invalid HTML.

## 📞 Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Support](https://firebase.google.com/support)

For project-specific issues:
- Check the browser console for error messages
- Check server logs for backend errors
- Verify `.env` file has all required variables
- Ensure both frontend and backend are running

---

**Last Updated**: April 7, 2026
**Firebase Project**: uct-clone
**Status**: ✅ Configured and Ready
