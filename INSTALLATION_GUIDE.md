# Installation & Setup Guide

## Overview

This project uses **pnpm** as the package manager (not npm). While npm can work, pnpm is recommended for better dependency resolution and faster installations.

## ⚠️ Dependency Conflict Issue

### The Problem
You may encounter this error when using `npm install`:

```
npm error ERESOLVE could not resolve
npm error While resolving: @builder.io/vite-plugin-jsx-loc@0.1.1
npm error Found: vite@7.3.2
npm error Could not resolve dependency:
npm error peer vite@"^4.0.0 || ^5.0.0" from @builder.io/vite-plugin-jsx-loc@0.1.1
```

### Why It Happens
The `@builder.io/vite-plugin-jsx-loc` package was built for Vite v4 and v5, but this project uses Vite v7. This creates a peer dependency conflict.

### Solution: Use pnpm (Recommended)

**pnpm** handles this conflict automatically through the overrides in `package.json`. This is why the project specifies pnpm as the package manager.

## 🚀 Installation Instructions

### Option 1: Using pnpm (Recommended)

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install

# Start development server
pnpm dev
```

**Why pnpm?**
- Automatically resolves peer dependency conflicts using the overrides in `package.json`
- Faster installation times
- Better disk space usage
- Stricter dependency management

### Option 2: Using npm with --legacy-peer-deps

If you prefer npm, use the `--legacy-peer-deps` flag:

```bash
# Install with legacy peer deps flag
npm install --legacy-peer-deps

# Start development server
npm run dev
```

**⚠️ Note**: This flag tells npm to ignore peer dependency conflicts. It works but is not ideal for production.

### Option 3: Using npm with --force

```bash
# Install with force flag
npm install --force

# Start development server
npm run dev
```

**⚠️ Note**: This is more aggressive and may result in unexpected behavior. Use only as a last resort.

## 📦 Recommended Setup

### Step 1: Install pnpm
```bash
npm install -g pnpm
```

### Step 2: Verify Installation
```bash
pnpm --version
# Should output: 10.4.1 or higher
```

### Step 3: Install Dependencies
```bash
cd /path/to/UCT_Fixed
pnpm install
```

### Step 4: Start Development
```bash
pnpm dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 🔧 Troubleshooting Installation Issues

### Issue: "pnpm: command not found"
```bash
# Install pnpm globally
npm install -g pnpm

# Or use npx to run pnpm without installing
npx pnpm install
```

### Issue: "ERESOLVE could not resolve" with npm
```bash
# Use one of these solutions:
npm install --legacy-peer-deps
# OR
npm install --force
```

### Issue: "Port 3000 or 3001 already in use"
```bash
# Find and kill the process using the port
# On macOS/Linux:
lsof -i :3000  # Find process on port 3000
kill -9 <PID>  # Kill the process

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Cannot find module 'firebase'"
```bash
# Ensure all dependencies are installed
pnpm install

# Or if using npm
npm install --legacy-peer-deps
```

### Issue: "ENOENT: no such file or directory, open '.env'"
```bash
# The .env file should exist in the project root
# If it doesn't, copy from .env.example
cp .env.example .env

# Then update .env with your Firebase credentials
```

## 📋 Available Commands

```bash
# Development
pnpm dev          # Start dev server (frontend + backend)
pnpm dev:client   # Start only frontend (if configured)
pnpm dev:server   # Start only backend (if configured)

# Building
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm check        # TypeScript type checking
pnpm format       # Format code with Prettier

# Database
pnpm seed         # Seed database with sample data

# Dependencies
pnpm install      # Install all dependencies
pnpm update       # Update dependencies
pnpm remove <pkg> # Remove a package
```

## 🔐 Environment Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Add Firebase Credentials
Edit `.env` and add your Firebase credentials:

```env
# Firebase Client SDK (browser-side, safe to expose)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/

# Firebase Admin SDK (server-side, keep secret!)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com

# API Configuration
VITE_API_URL=http://localhost:3001
PORT=3001
APP_URL=http://localhost:3000
```

### 3. Get Firebase Credentials
See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) for detailed instructions on obtaining these values.

## ✅ Verification Checklist

After installation, verify everything is working:

- [ ] Dependencies installed without errors
- [ ] `.env` file exists with Firebase credentials
- [ ] `pnpm dev` starts without errors
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API accessible at http://localhost:3001/api/health
- [ ] No console errors in browser
- [ ] Registration page loads at http://localhost:3000/register
- [ ] Can create a test account
- [ ] Can log in with test account

## 🐛 Debug Mode

To run with additional debugging:

```bash
# Enable debug logging
DEBUG=* pnpm dev

# Or for specific modules
DEBUG=firebase:* pnpm dev
```

## 📚 Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [npm Documentation](https://docs.npmjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express Documentation](https://expressjs.com/)

## 🆘 Still Having Issues?

1. **Check the logs**: Look at the terminal output for specific error messages
2. **Verify environment**: Ensure `.env` file has all required variables
3. **Clear cache**: 
   ```bash
   pnpm store prune  # For pnpm
   npm cache clean --force  # For npm
   ```
4. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules pnpm-lock.yaml  # or package-lock.json for npm
   pnpm install  # or npm install --legacy-peer-deps
   ```
5. **Check ports**: Ensure ports 3000 and 3001 are available
6. **Read the guides**: See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) and [FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md)

---

**Last Updated**: April 7, 2026
**Package Manager**: pnpm 10.4.1
**Node Version**: 18+ recommended
