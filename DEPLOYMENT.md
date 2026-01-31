# Deploy Freely to GitHub and Vercel

## Step 1: Push to GitHub

After creating your GitHub repository at https://github.com/new, run these commands:

```powershell
# Add the vercel.json to git
git add vercel.json .gitignore

# Commit the new config
git commit -m "Add Vercel configuration"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/freely-photo-map.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new

2. Sign in with GitHub (recommended)

3. Click "Import Git Repository"

4. Select your "freely-photo-map" repository

5. Configure project:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `./`
   - Install Command: (leave empty)

6. Click "Deploy"

7. Wait 30-60 seconds... ✅ DONE!

## Your Live URL

Your app will be live at:
```
https://freely-photo-map.vercel.app
```

Or a custom URL like:
```
https://freely-photo-map-YOUR_USERNAME.vercel.app
```

## Custom Domain (Optional)

To add a custom domain:
1. Go to your project in Vercel
2. Settings → Domains
3. Add your domain
4. Follow DNS instructions

---

**Need help?** Let me know!
