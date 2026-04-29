# 🔧 Upload Troubleshooting Guide

## ❌ Problem: Cannot Upload Image

Let's debug this step-by-step:

---

## ✅ Step 1: Check Backend is Running

Open PowerShell and run:
```powershell
cd c:\Users\VRUSHTI\Desktop\edit
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║   🚀 Kurti Background Remover Server Started         ║
╚════════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
📝 API Key: ✓ Configured
```

**❌ If you see an error:**
- Make sure you ran `npm install` first
- Check `.env` file exists and has API key
- Try `npm start` again

---

## ✅ Step 2: Check Browser Console

1. Open your browser
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Reload the page (Ctrl+R)

**What to look for:**
- ✅ You should see: `🔍 Checking server health...`
- ✅ Then: `✅ Server is running...`
- ✅ Then: `✅ API key is configured`

**If you see errors:**
- Screenshot the errors
- See troubleshooting sections below

---

## ✅ Step 3: Try Uploading an Image

1. Open http://localhost:3000
2. Click the upload area
3. Select an image file (JPG or PNG)
4. Watch the browser console

**Expected console output:**
```
📁 File upload started: myimage.jpg image/jpeg 245000
📖 File read successfully
🖼️ Image loaded successfully: 800 x 600
✅ Image uploaded successfully! Now remove the background.
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot connect to backend server"

**Cause:** Server isn't running

**Fix:**
```powershell
cd c:\Users\VRUSHTI\Desktop\edit
npm start
# Wait for message "Server running at http://localhost:3000"
# Then open http://localhost:3000 in browser
```

---

### Issue 2: "API key not configured"

**Cause:** `.env` file missing or empty

**Fix:**
1. Check `.env` file exists in the `edit` folder
2. Edit it with Notepad:
```
REMOVE_BG_API_KEY=YOUR_API_KEY_HERE
PORT=3000
```
3. Save the file
4. Restart server: `npm start`

---

### Issue 3: "Error reading file" in console

**Cause:** File upload is failing

**Fix:**
- Try a different image file
- Make sure file is JPG or PNG
- File should be under 10MB
- Try a smaller file first (test with 1-2MB image)

---

### Issue 4: "Error loading image"

**Cause:** Image file corrupted or wrong format

**Fix:**
- Try another image
- Open the image in Paint to verify it's valid
- Try a standard JPG or PNG file
- Avoid unusual formats (WebP, GIF, etc.)

---

### Issue 5: "Port 3000 already in use"

**Cause:** Another app using port 3000

**Fix:**
Edit `.env` and change PORT:
```
PORT=3001
```
Then restart server and open: http://localhost:3001

---

## 🔍 Advanced Debugging

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

If these show versions, Node.js is installed. If not, download from https://nodejs.org

### Check if dependencies are installed:
```powershell
cd c:\Users\VRUSHTI\Desktop\edit
npm list
```

If you see errors, run: `npm install`

### Test backend directly:
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

---

## 📝 Checklist Before Uploading

- [ ] Backend server is running (`npm start`)
- [ ] Browser console shows no errors (F12)
- [ ] `.env` file has your API key
- [ ] Using JPG or PNG image
- [ ] Image is under 10MB
- [ ] Opening http://localhost:3000 (NOT http://localhost:3000/index.html)

---

## 🆘 Still Having Issues?

1. Open DevTools console (F12)
2. Try uploading image
3. Take a screenshot of any error messages
4. Check QUICK_START.md and BACKEND_SETUP.md
5. Verify `.env` file is correct

---

## ✅ Quick Restart (Nuclear Option)

If nothing works, try this complete restart:

```powershell
# Stop current server (Ctrl+C if running)

# Reinstall everything
cd c:\Users\VRUSHTI\Desktop\edit
rm node_modules -r -Force
npm install

# Start fresh
npm start
```

Then open: http://localhost:3000

---

**Still stuck?** The console errors (F12) usually tell you exactly what's wrong!
