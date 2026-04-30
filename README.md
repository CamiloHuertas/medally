# MedAlly — Setup Guide

## What you need before starting
- Node.js v18 → https://nodejs.org (download the LTS version)
- A free Google account (for Firebase)

---

## Step 1 — Set up Firebase (the backend)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `medally` → click through and hit **Create project**
3. Once inside the project, click the **web icon (</>)** to add a web app
4. Give it a nickname (e.g. `medally-web`) → click **Register app**
5. You'll see a block of code with your config. **Copy these values** — you'll need them in a moment:
   ```
   apiKey: "..."
   authDomain: "..."
   projectId: "..."
   storageBucket: "..."
   messagingSenderId: "..."
   appId: "..."
   ```

### Enable Authentication
1. In the left sidebar → click **Authentication** → **Get started**
2. Click **Email/Password** → toggle it **on** → Save

### Enable Firestore Database
1. In the left sidebar → click **Firestore Database** → **Create database**
2. Choose **Start in test mode** → click Next → pick any location → Done

### Set Security Rules (so users can only see their own data)
1. In Firestore → click the **Rules** tab
2. Replace everything with this and click **Publish**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Step 2 — Add your Firebase config to the app

1. Open the file `src/firebase/config.js`
2. Replace each `REPLACE_WITH_YOUR_...` with the actual values you copied from Firebase

---

## Step 3 — Install and run the app

Open a terminal in the `medally` folder and run:

```
npm install
npm start
```

The app will open automatically at http://localhost:3000

---

## How to open it on your phone

While `npm start` is running on your computer:

1. Make sure your phone is on the **same Wi-Fi** as your computer
2. Find your computer's local IP address:
   - Windows: open Command Prompt → type `ipconfig` → look for **IPv4 Address** (e.g. 192.168.1.5)
   - Mac: open Terminal → type `ipconfig getifaddr en0`
3. On your phone's browser, go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.5:3000`

That's it — the app works on your phone browser too.

---

## Project structure

```
medally/
  src/
    firebase/
      config.js        ← Your Firebase credentials go here
    pages/
      LoginPage.js     ← Sign in / Sign up screen
      Dashboard.js     ← Main layout with sidebar
      Home.js          ← Summary screen
      Symptoms.js      ← Log and view symptoms
      Medications.js   ← Manage medications
      Report.js        ← Generate and share health report
    components/
      Shared.module.css ← Shared styles
  public/
    index.html
  package.json
```
