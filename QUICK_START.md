# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
pnpm install
# or if using npm
npm install --legacy-peer-deps
```

### Step 2: Configure Firebase (One-time setup)
1. Open `.env` file
2. Add your Firebase credentials (see [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md))
3. Especially add: `FIREBASE_PRIVATE_KEY`

### Step 3: Start Development
```bash
pnpm dev
```

Done! Your app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

---

## 📋 Common Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend |
| `pnpm dev:frontend` | Start only frontend (port 3000) |
| `pnpm dev:backend` | Start only backend (port 3001) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm check` | Check TypeScript types |
| `pnpm format` | Format code with Prettier |
| `pnpm seed` | Seed database with sample data |

---

## 🔧 Troubleshooting

### Issue: `ERR_CONNECTION_REFUSED` on port 3001
**Solution**: Backend is not running. Use `pnpm dev` to start both servers.

### Issue: `npm error ERESOLVE could not resolve`
**Solution**: Use `npm install --legacy-peer-deps` instead of `npm install`.

### Issue: Port 3000 or 3001 already in use
**Solution**: Kill the process using that port:
```bash
# macOS/Linux
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Issue: Firebase Admin is not initialized
**Solution**: Add `FIREBASE_PRIVATE_KEY` to `.env` file.

---

## 📖 Documentation

- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Detailed installation steps
- **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)** - Firebase configuration
- **[BACKEND_STARTUP_GUIDE.md](./BACKEND_STARTUP_GUIDE.md)** - Backend troubleshooting
- **[FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md)** - Verification checklist
- **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** - Summary of all fixes

---

## 🧪 Testing the App

1. **Frontend loads**: Visit http://localhost:3000
2. **Backend responds**: Visit http://localhost:3001/api/health
3. **Registration works**: Go to http://localhost:3000/register and create an account
4. **Login works**: Go to http://localhost:3000/login and sign in
5. **Dashboard loads**: After login, you should see the dashboard

---

## 🎯 What's Fixed

✅ HTML hydration error in Register.tsx
✅ NPM dependency conflicts resolved
✅ Firebase fully configured
✅ Backend and frontend startup unified
✅ Comprehensive documentation added

---

## 💡 Tips

- Use `pnpm` instead of `npm` for better dependency management
- Keep `.env` file with your Firebase credentials (don't commit to git)
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Use `DEBUG=*` for detailed logging

---

**Ready to develop!** 🎉

For detailed help, see the documentation files above.
