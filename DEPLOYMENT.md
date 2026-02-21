# Benasa Studios – Deployment Guide

## 🚀 Quick Start: Deploy to Netlify (2 minutes)

### Step 1: Drag & Drop to Netlify
1. Go to **https://app.netlify.com**
2. Sign in with your account (or create one for free)
3. Click **"Add new site"** → **"Deploy manually"**
4. **Drag & drop this entire folder** (`c:\Users\Snew GH\Downloads\benasa`) into the upload area
5. Netlify will build and deploy automatically
6. You'll get a live URL like `https://[site-name].netlify.app`

### Step 2 (Optional): Connect Your Domain
After site is live:
1. In Netlify dashboard → **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `benasastudios.com`
4. Update your DNS registrar with Netlify's nameservers (Netlify will provide them)
5. DNS typically takes 24–48 hours to propagate

---

## � Alternative: Deploy to Vercel (2 minutes)

### Step 1: Connect Repository to Vercel
1. Go to **https://vercel.com**
2. Sign in or create a free account
3. Click **"Add New..."** → **"Project"**
4. Choose **"Import Git Repository"** or **"Import from Folder"**
5. If importing from folder: upload the `benasa` project folder
6. Vercel will automatically detect the `vercel.json` configuration
7. Click **"Deploy"** — site deploys in 30-60 seconds
8. You'll get a live URL like `https://benasa-[random].vercel.app`

### Step 2 (Optional): Connect Your Domain
After site is live:
1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter `benasastudios.com`
4. Update your DNS registrar with Vercel's nameservers
5. DNS typically takes 24–48 hours to propagate

### Why Choose Vercel?
- ✅ Faster deployment (~30 seconds vs 1-2 minutes)
- ✅ Built-in serverless functions (for future API expansion)
- ✅ Edge functions for global performance
- ✅ Analytics dashboard included
- ✅ Git integration (auto-deploy on push)
- ✅ Better for real-time applications

---

## 📋 Pre-Deployment Checklist

- ✅ `index.html` – main landing page with Firebase config
- ✅ `dashboard.html` – internal team dashboard
- ✅ `netlify.toml` – security headers & caching rules (Netlify)
- ✅ `vercel.json` – security headers & caching rules (Vercel)
- ✅ `404.html` – custom error page with animations
- ✅ `firestore.rules` – production-safe Firestore rules
- ✅ Contact form configured with Netlify Forms (or custom endpoint)
- ✅ JSON-LD SEO structured data included
- ✅ All accessibility features (ARIA, skip links)

---

## 🔧 Cloud Functions Deployment (Requires Blaze Billing)

### Prerequisites
Your Firebase project **must be on Blaze (pay-as-you-go) billing** to deploy Cloud Functions.

### Upgrade to Blaze
1. Open: https://console.firebase.google.com/project/benasastudios-1d310/usage/details
2. Click **"Upgrade to Blaze"**
3. Complete the billing setup
4. Wait ~2 minutes for APIs to enable

### Deploy Functions (After Billing Upgrade)
Run from the repo root:

```bash
cd c:\Users\Snew GH\Downloads\benasa
npm install  # (in root, if needed)
npx firebase-tools deploy --only functions --project benasastudios-1d310
```

This deploys:
- `setAdminClaim()` – callable function to set admin roles
- `listUsers()` – callable function to list Firebase Auth users (dashboard integration)

### Verify Deployment
In Firebase Console:
1. Go to **Cloud Functions** tab
2. Should see both `setAdminClaim` and `listUsers` deployed with green checkmarks

---

## ✅ Post-Deployment Verification

### Netlify Site
1. Open your `.netlify.app` URL or custom domain
2. Check:
   - [ ] Page loads without 404
   - [ ] Hero section displays with 3D globe animation
   - [ ] Navigation menu is responsive
   - [ ] Pricing tiers show all four options (Starter, Standard, Plus, Enterprise)
   - [ ] Contact form can be typed into
   - [ ] Form submission works (check Netlify Forms dashboard)
   - [ ] Mobile responsiveness (test on phone/tablet)
   - [ ] No JavaScript errors (F12 → Console tab should be clean)

### Firebase Integration
1. Sign into dashboard at `/dashboard.html`
2. Check:
   - [ ] Firebase Auth login/logout works
   - [ ] User data persists in Firestore
   - [ ] Partner referral tracking records visits/conversions
   - [ ] Cloud Functions callable from dashboard (if deployed)

### Netlify Forms
1. In Netlify dashboard → **Site** → **Forms**
2. Submit a test message via the contact form
3. Check that submission appears in Forms dashboard
4. (Optional) Set email notifications for form submissions

---

## 🐛 Troubleshooting

### Site shows 404 error
- **Cause:** Wrong folder deployed or routing misconfigured
- **Fix (Netlify):** Make sure you dragged the entire `benasa` project folder (with `index.html` at root)
- **Fix (Vercel):** Check `vercel.json` is in root; verify `buildCommand` and `outputDirectory`

### Contact form not submitting
- **Cause:** Form not deployed with Netlify Forms enabled (Netlify only)
- **Fix:** Ensure `netlify.toml` is in root; Netlify will auto-detect `data-netlify="true"` on form
- **Note:** If using Vercel, you'll need to set up a custom backend endpoint for form handling

### Firebase not initializing
- **Cause:** Firebase credentials not embedded or connectivity issue
- **Fix:** Open browser DevTools (F12) → Console; check for Firebase init errors
- **Ensure:** Both `index.html` and `dashboard.html` have identical Firebase config

### Dashboard won't authenticate
- **Cause:** Firestore rules blocking access or Firebase project not set up
- **Fix:** Ensure Firestore database exists and rules are deployed: `firebase deploy --only firestore`

### Cloud Functions not available
- **Cause:** Blaze billing not enabled or functions not deployed
- **Fix:** 
  1. Check Firebase Console → **Billing** (must be Blaze)
  2. Run: `npx firebase-tools deploy --only functions`
  3. Check Cloud Functions tab for green checkmarks

### Vercel deployment shows blank pages
- **Cause:** Static files not being served (missing `outputDirectory`)
- **Fix:** Verify `vercel.json` has `"outputDirectory": "."` pointing to project root

### Netlify form submissions not appearing
- **Cause:** Netlify Forms API not recognizing form fields
- **Fix:** Re-deploy the site after ensuring `data-netlify="true"` is on the form tag

---

## 📞 Support & Maintenance

### Monthly Costs Comparison

**Netlify:**
- Free tier (up to 300 minutes/month builds, unlimited static deployments)
- Pro: $19/month (for enhanced features, not needed for this site)

**Vercel:**
- Free tier (unlimited deployments, perfect for static sites)
- Pro: $20/month (for advanced features like analytics)

**Firebase (Both platforms):**
- Blaze (pay-per-use): ~$0–$50/month for typical usage
- Includes Firestore, Cloud Functions, Storage, Authentication

### Recommendation
For a static site like this, use **Vercel Free** for best performance or **Netlify Free** if you prefer their ecosystem.

### Accessing Logs
- **Netlify:** Dashboard → **Site** → **Builds** (see deployment logs)
- **Firebase:** Console → **Functions** → Function name → **Logs**

### Updating the Site
1. Make edits to `index.html`, `dashboard.html`, or other files locally
2. Drag & drop to Netlify again (or use Git integration if set up)
3. New deployment takes ~1–2 minutes

---

## 🎯 Done!
Your site is now live. Share the URL with clients, partners, and team members.

For questions about Cloud Functions, Firestore rules, or Firebase config, see `firebase.json` and `firestore.rules` in the repo.
