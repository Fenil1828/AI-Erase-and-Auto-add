# ⚡ Quick Reference Card

## 🚀 Get Started in 3 Steps

### Step 1: Install Backend
```powershell
cd c:\Users\VRUSHTI\Desktop\edit
npm install
```

### Step 2: Configure .env
Edit the `.env` file with your Remove.bg API key:
```
REMOVE_BG_API_KEY=YOUR_API_KEY_HERE
PORT=3000
```

Get free API key: https://remove.bg/api

### Step 3: Start & Open
```powershell
npm start
```
Then open: **http://localhost:3000**

---

## 📁 Files You Need to Know About

| File | Purpose |
|------|---------|
| `server.js` | 🔒 Backend server (handles API key) |
| `.env` | 🔑 Your API key (KEEP SECRET!) |
| `package.json` | 📦 Dependencies |
| `index.html` | 🎨 Frontend UI |
| `app.js` | ⚙️ Frontend logic |

---

## 🔐 Why Backend?

```
❌ Old Way (Frontend Only)
   Browser contains API key
   → Security risk!

✅ New Way (Backend)
   Backend holds API key
   Browser sends images
   Backend returns results
   → Secure! ✓
```

---

## 📞 Common Commands

| Command | What It Does |
|---------|-------------|
| `npm install` | Install dependencies (run once) |
| `npm start` | Start backend server |
| `npm run dev` | Start with auto-reload (requires nodemon) |

---

## 🧪 Quick Tests

### Test Backend Health
```powershell
curl http://localhost:3000/api/health
```

### Test Full Flow
1. Open http://localhost:3000
2. Upload image
3. Click "Remove Background"
4. Choose scene
5. Download

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "npm: command not found" | Install Node.js from https://nodejs.org |
| "Cannot find module" | Run `npm install` |
| "API key not configured" | Check `.env` file has correct key |
| "Port 3000 already in use" | Change PORT in `.env` to 3001 |

---

## 📚 Full Documentation

- **Backend Setup**: Read `BACKEND_SETUP.md`
- **General Info**: Read `README.md`
- **Frontend Code**: Check `app.js` and `index.html`
- **Backend Code**: Check `server.js`

---

## 🎯 Next Action

```bash
cd c:\Users\VRUSHTI\Desktop\edit
npm install
# Then follow Step 2 & 3 above
```

**That's it!** 🎉
