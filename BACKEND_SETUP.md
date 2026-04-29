# 🔒 Backend Setup Guide (Secure API Key Handling)

## Why Backend?

✅ **API Key Never Exposed** — Keep Remove.bg API key secret  
✅ **Secure** — No credentials in frontend code  
✅ **Professional** — Industry best-practice  
✅ **Scalable** — Easy to add more features  

---

## 📋 Prerequisites

You need **Node.js** installed on your computer.

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

If you see version numbers, you're good!  
If not, download from: https://nodejs.org/ (LTS version)

---

## 🚀 Setup Steps

### Step 1: Get Your Remove.bg API Key

1. Visit: https://remove.bg/api
2. Sign up for FREE account
3. Copy your API key from the dashboard
4. Keep it safe! 🔐

### Step 2: Install Backend Dependencies

Open PowerShell in the `edit` folder:

```powershell
cd c:\Users\VRUSHTI\Desktop\edit
npm install
```

This installs:
- `express` — Web server
- `multer` — File upload handler
- `cors` — Cross-origin requests
- `dotenv` — Environment variables
- `node-fetch` — Make API calls

### Step 3: Configure API Key

Open the `.env` file in the `edit` folder and add your API key:

```env
REMOVE_BG_API_KEY=your_api_key_here
PORT=3000
```

**⚠️ IMPORTANT:** Add `.env` to `.gitignore` if using Git (never commit secrets!)

### Step 4: Start the Backend Server

```powershell
npm start
```

You'll see:
```
╔════════════════════════════════════════════════════════╗
║   🚀 Kurti Background Remover Server Started         ║
╚════════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
📝 API Key: ✓ Configured

🔌 Endpoints:
  • GET  / — Main app
  • GET  /api/health — Server health check
  • POST /api/remove-background — Process image
```

### Step 5: Open the App

Open your browser:
```
http://localhost:3000
```

That's it! 🎉

---

## 📚 How It Works

```
Frontend (Browser)
    ↓
    ├─ User uploads image
    ├─ Sends to backend
    ↓
Backend (Node.js Server)
    ├─ Receives image file
    ├─ Calls Remove.bg API (with secret API key)
    ├─ Gets back transparent PNG
    ├─ Returns to frontend
    ↓
Frontend (Browser)
    ├─ Displays result
    ├─ User composites on background
    └─ Downloads final image
```

**Key Point:** API key never leaves the server! ✅

---

## 🔧 Project Structure

```
edit/
├── server.js              # Backend server (NEW)
├── package.json           # Dependencies (NEW)
├── .env                   # API key (NEW - KEEP SECRET!)
├── .gitignore             # Ignore .env (recommended)
├── index.html             # Frontend UI
├── app.js                 # Frontend logic (updated)
├── README.md              # Documentation
└── SETUP_GUIDE.md         # This file
```

---

## 🧪 Test the Setup

### Option A: Check Server Health
```powershell
curl http://localhost:3000/api/health
```

You should get:
```json
{
  "status": "ok",
  "apiKeyConfigured": true,
  "message": "API key is configured"
}
```

### Option B: Test Full Flow
1. Open http://localhost:3000
2. Upload an image
3. Click "Remove Background"
4. Wait 3-5 seconds
5. Select a scene
6. Download result

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
**Solution:** Run `npm install` first

### "API key not configured"
**Solution:** Check your `.env` file has the correct API key

### "Backend not running"
**Solution:** Run `npm start` in PowerShell

### "Port 3000 already in use"
**Solution:** Change PORT in `.env` file:
```env
PORT=3001
# Then open: http://localhost:3001
```

### "Invalid API key error"
**Solution:** 
- Check API key is correct (copy from remove.bg again)
- Make sure .env has exact key with no spaces
- API keys are case-sensitive

---

## 🚀 For Development

Use `nodemon` for auto-restart on changes:

```powershell
npm run dev
```

Then edit `server.js` and it reloads automatically!

---

## 🔒 Security Best Practices

✅ **DO:**
- Keep `.env` file secret
- Add `.env` to `.gitignore`
- Use environment variables for all secrets
- Never commit API keys to Git
- Regenerate API keys if exposed

❌ **DON'T:**
- Put API keys in frontend code
- Commit `.env` file to Git
- Share your API key with anyone
- Hardcode secrets in source code

---

## 📦 Deployment (Optional)

To deploy to a production server (Heroku, AWS, etc.):

1. Set `REMOVE_BG_API_KEY` as environment variable
2. Deploy `server.js`, `package.json`, and other files
3. Frontend auto-connects to backend

Example for Heroku:
```powershell
heroku config:set REMOVE_BG_API_KEY=your_key_here
git push heroku main
```

---

## 💡 Next Steps

- ✅ Install dependencies (`npm install`)
- ✅ Set API key in `.env`
- ✅ Start server (`npm start`)
- ✅ Open app in browser
- ✅ Start removing backgrounds!

---

**Questions?** Check README.md for more info!
