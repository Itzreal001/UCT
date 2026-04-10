# Backend Startup & Troubleshooting Guide

## Overview

The `ERR_CONNECTION_REFUSED` error on port 3001 indicates that the backend server is not running or not reachable. This guide explains how to properly start both the frontend and backend servers.

## 🚀 Quick Start

### Recommended: Unified Dev Command

The easiest way to start both servers is to use the unified dev command:

```bash
pnpm dev
# or with npm
npm run dev
```

This single command will:
1. Start the backend server on port 3001
2. Wait 2 seconds for the backend to initialize
3. Start the frontend dev server on port 3000
4. Display logs from both servers

**Result:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

### Alternative: Run Servers Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Backend:**
```bash
pnpm dev:backend
# or with npm
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
pnpm dev:frontend
# or with npm
npm run dev:frontend
```

## 🔧 Understanding the Error

### What is ERR_CONNECTION_REFUSED?

This error occurs when:
- The backend server is not running
- The backend is running on a different port
- The frontend cannot reach the backend at the configured URL
- There's a firewall blocking the connection

### Common Causes

| Cause | Solution |
|-------|----------|
| Backend not started | Run `pnpm dev` or `pnpm dev:backend` |
| Backend crashed | Check server logs for errors |
| Wrong port configured | Verify `VITE_API_URL=http://localhost:3001` in `.env` |
| Port 3001 already in use | Kill the process using port 3001 |
| Firewall blocking | Check firewall settings |

## 📋 Troubleshooting Steps

### Step 1: Verify Backend is Running

```bash
# Check if port 3001 is listening
# On macOS/Linux:
lsof -i :3001

# On Windows:
netstat -ano | findstr :3001
```

If nothing appears, the backend is not running.

### Step 2: Check Backend Logs

When you run `pnpm dev:backend`, you should see:
```
Server running on http://localhost:3001
API: http://localhost:3001/api
Frontend dev server: http://localhost:3000
```

If you don't see this, check for errors in the output.

### Step 3: Test Backend Directly

Open your browser and visit:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-04-07T10:00:00.000Z"
}
```

If you get an error, the backend has an issue.

### Step 4: Check Environment Variables

Verify your `.env` file has:
```env
VITE_API_URL=http://localhost:3001
PORT=3001
```

### Step 5: Check Firebase Configuration

The backend requires Firebase Admin SDK credentials. Verify in `.env`:
```env
FIREBASE_PROJECT_ID=uct-clone
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_DATABASE_URL=...
FIREBASE_STORAGE_BUCKET=...
```

If `FIREBASE_PRIVATE_KEY` is missing, the backend will fail to start.

## 🐛 Common Backend Errors

### Error: "Cannot find module 'firebase-admin'"

**Solution:**
```bash
pnpm install
# or
npm install --legacy-peer-deps
```

### Error: "Firebase Admin is not initialized"

**Cause:** Missing `FIREBASE_PRIVATE_KEY` in `.env`

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project `uct-clone`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Add to `.env`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Error: "listen EADDRINUSE :::3001"

**Cause:** Port 3001 is already in use

**Solution:**
```bash
# Find the process using port 3001
# On macOS/Linux:
lsof -i :3001
kill -9 <PID>

# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use a different port:
PORT=3002 pnpm dev:backend
```

### Error: "CORS error" or "Access denied"

**Cause:** Frontend and backend are not communicating properly

**Solution:**
1. Ensure both are running:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:3001
2. Check `VITE_API_URL` in `.env` is `http://localhost:3001`
3. Restart both servers

### Error: "Cannot POST /api/auth/register"

**Cause:** Backend server is running but routes are not loaded

**Solution:**
1. Check backend logs for errors
2. Verify all dependencies are installed: `pnpm install`
3. Restart backend: `pnpm dev:backend`

## 🔍 Debugging Backend Issues

### Enable Debug Logging

```bash
DEBUG=* pnpm dev:backend
```

This will show detailed logs from all modules.

### Check Specific Module Logs

```bash
# Firebase logs
DEBUG=firebase:* pnpm dev:backend

# Express logs
DEBUG=express:* pnpm dev:backend

# All logs
DEBUG=* pnpm dev:backend
```

### Monitor Network Requests

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to register or login
4. Look for failed requests to `http://localhost:3001/api/...`
5. Click on the failed request to see error details

## 📊 Server Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Computer                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐          ┌──────────────────┐     │
│  │   Frontend       │          │   Backend        │     │
│  │  (Vite + React)  │◄────────►│  (Express.js)    │     │
│  │ :3000            │  HTTP    │  :3001           │     │
│  │                  │          │                  │     │
│  │ - UI Components  │          │ - API Routes     │     │
│  │ - Firebase Auth  │          │ - Firebase Admin │     │
│  │ - API Calls      │          │ - Database Ops   │     │
│  └──────────────────┘          └──────────────────┘     │
│         │                               │                │
│         │                               │                │
│         └───────────────┬───────────────┘                │
│                         │                                │
│                         ▼                                │
│                  ┌──────────────┐                        │
│                  │   Firebase   │                        │
│                  │   Cloud      │                        │
│                  │ (Auth, DB,   │                        │
│                  │  Storage)    │                        │
│                  └──────────────┘                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## ✅ Verification Checklist

After starting the servers, verify:

- [ ] Backend logs show "Server running on http://localhost:3001"
- [ ] Frontend loads at http://localhost:3000
- [ ] No errors in browser console
- [ ] No errors in terminal
- [ ] `http://localhost:3001/api/health` returns `{"status":"ok",...}`
- [ ] Can navigate to registration page
- [ ] No "ERR_CONNECTION_REFUSED" errors
- [ ] Network tab shows successful API calls

## 🆘 Still Having Issues?

1. **Check the logs**: Read both frontend and backend terminal output
2. **Verify ports**: Ensure 3000 and 3001 are available
3. **Verify environment**: Check `.env` has all required variables
4. **Restart everything**:
   ```bash
   # Kill all Node processes
   pkill -f node
   # or on Windows
   taskkill /F /IM node.exe
   
   # Clear cache and reinstall
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   pnpm dev
   ```
5. **Check Firebase**: Verify credentials are correct
6. **Read guides**: See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

## 📚 Related Documentation

- [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) - Installation instructions
- [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) - Firebase configuration
- [FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md) - Verification checklist
- [FIXES_APPLIED.md](./FIXES_APPLIED.md) - Summary of fixes

---

**Last Updated**: April 7, 2026
**Status**: Ready for development ✅
