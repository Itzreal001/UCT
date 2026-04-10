# Firebase Connection Checklist

## ✅ Pre-Setup Verification

Use this checklist to verify your Firebase setup is complete.

### 1. Environment Variables
- [ ] `.env` file exists in project root
- [ ] `VITE_FIREBASE_API_KEY` is set
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` is set
- [ ] `VITE_FIREBASE_PROJECT_ID` is set
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` is set
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` is set
- [ ] `VITE_FIREBASE_APP_ID` is set
- [ ] `VITE_FIREBASE_DATABASE_URL` is set
- [ ] `FIREBASE_PRIVATE_KEY` is set (required for server)
- [ ] `FIREBASE_CLIENT_EMAIL` is set (required for server)
- [ ] `FIREBASE_DATABASE_URL` is set (required for server)
- [ ] `FIREBASE_STORAGE_BUCKET` is set (required for server)
- [ ] `VITE_API_URL` is set to `http://localhost:3001`

### 2. Firebase Console Setup
- [ ] Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Project name is `uct-clone`
- [ ] Authentication enabled (Email/Password provider)
- [ ] Firestore Database created
- [ ] Realtime Database created
- [ ] Storage bucket created
- [ ] Service account created and private key downloaded

### 3. Code Setup
- [ ] `client/src/lib/firebase.ts` exists and exports `auth`, `firestore`, `rtdb`, `storage`
- [ ] `server/lib/firebase.ts` exists and exports `adminAuth`, `db`, `rtdb`, `storage`
- [ ] `client/src/contexts/AuthContext.tsx` wraps app with auth provider
- [ ] `App.tsx` includes `<AuthProvider>` wrapper
- [ ] `client/src/lib/api.ts` includes Firebase token in API calls
- [ ] `server/routes/auth.ts` handles registration and verification

### 4. Dependencies Installed
```bash
pnpm install
```
- [ ] `firebase` package installed (client)
- [ ] `firebase-admin` package installed (server)
- [ ] All other dependencies installed

### 5. Development Server
```bash
pnpm dev
```
- [ ] Frontend runs on `http://localhost:3000`
- [ ] Backend runs on `http://localhost:3001`
- [ ] No CORS errors in console
- [ ] No Firebase initialization errors

### 6. Registration Test
- [ ] Navigate to `http://localhost:3000/register`
- [ ] Fill in registration form
- [ ] Click "Register"
- [ ] Success message appears
- [ ] User created in Firebase Console > Authentication
- [ ] User profile created in Firestore > `users` collection

### 7. Login Test
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter registered email and password
- [ ] Click "Sign In"
- [ ] Redirected to dashboard
- [ ] User profile loads correctly

### 8. Protected Routes
- [ ] Dashboard page loads when authenticated
- [ ] Dashboard shows user information
- [ ] Logout button works
- [ ] Redirected to login when accessing protected routes without auth

## 🔧 Common Issues & Fixes

### Firebase Admin SDK Error
**Error**: `Firebase Admin is not initialized` or `Cannot read properties of undefined`

**Fix**: 
1. Ensure `FIREBASE_PRIVATE_KEY` is in `.env`
2. Key must include literal `\n` for newlines (not escaped)
3. Restart server: `pnpm dev`

### CORS Error
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix**:
1. Ensure backend is running on port 3001
2. Ensure frontend is running on port 3000
3. Check `VITE_API_URL=http://localhost:3001` in `.env`
4. Restart both servers

### Token Verification Error
**Error**: `Invalid or expired token`

**Fix**:
1. Check `FIREBASE_PRIVATE_KEY` is correctly set
2. Token expires after 1 hour - refresh page to get new token
3. Check backend logs for detailed error
4. Ensure `adminAuth.verifyIdToken()` can access Firebase Admin SDK

### Firestore Permission Denied
**Error**: `Missing or insufficient permissions` in Firestore

**Fix**:
1. Go to Firebase Console > Firestore > Rules
2. Set test rules (development only):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. For production, implement proper security rules

### Storage Permission Denied
**Error**: `Firebase Storage: User does not have permission to access`

**Fix**:
1. Go to Firebase Console > Storage > Rules
2. Set test rules (development only):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start development (frontend + backend)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Check TypeScript
pnpm check

# Format code
pnpm format
```

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in production environment
- [ ] `FIREBASE_PRIVATE_KEY` stored securely (not in code)
- [ ] Firestore security rules configured properly
- [ ] Storage security rules configured properly
- [ ] Realtime Database rules configured properly
- [ ] CORS origin updated to production domain
- [ ] Rate limiting configured appropriately
- [ ] Error logging configured
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place
- [ ] SSL/TLS certificate configured

## 📞 Getting Help

1. **Check logs**: Look at browser console and server terminal for errors
2. **Verify config**: Run through the checklist above
3. **Firebase Console**: Check project settings and service accounts
4. **Documentation**: See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
5. **Firebase Support**: Visit [firebase.google.com/support](https://firebase.google.com/support)

---

**Status**: Ready to use ✅
