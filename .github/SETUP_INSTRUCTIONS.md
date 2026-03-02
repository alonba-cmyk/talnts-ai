# 🚀 GitHub Actions Setup Instructions

## Overview
This repository automatically syncs content to `DaPulse/dapulse-homepage-react` in the `static/monday-for-agents` folder whenever you commit to the main branch.

## ⚙️ Required Setup (One-time only)

### 1. Create GitHub Personal Access Token

**You need to create this token manually:**

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set these permissions:
   - **Expiration:** No expiration (or 1 year)
   - **Scopes:** Check `repo` (full repository access)
   - **Note:** "Monday Agents Sync Token"
4. Click **"Generate token"**
5. **⚠️ COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### 2. Add Token to Repository Secrets

1. Go to this repository: [`novalystrix/monday-agents-pr`](https://github.com/novalystrix/monday-agents-pr)
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Set:
   - **Name:** `MONDAY_GITHUB_TOKEN`
   - **Secret:** Paste the token you copied above
5. Click **"Add secret"**

## 🎯 How It Works

### Automatic Sync
Every time you commit to `master` or `main`:
1. **Detects changes** in your repository
2. **Syncs files** to `DaPulse/dapulse-homepage-react/static/monday-for-agents/`
3. **Creates a PR** targeting the `monday-for-agents` branch
4. **Assigns PR to you** for review

### Manual Trigger
You can also run it manually:
1. Go to **Actions** tab
2. Select **"Sync to Monday.com Repository"**
3. Click **"Run workflow"**

## 📁 Files That Get Synced

The workflow syncs these files/folders:
- `src/` → `static/monday-for-agents/src/`
- `public/` → `static/monday-for-agents/public/`
- `docs/` → `static/monday-for-agents/docs/`
- `guidelines/` → `static/monday-for-agents/guidelines/`
- `index.html` → `static/monday-for-agents/index.html`
- `*.md` files → `static/monday-for-agents/*.md`
- Configuration files (package.json, vite.config.ts, etc.)

## 🔧 Testing the Setup

### Test 1: Manual Run
1. Complete the token setup above
2. Go to **Actions** tab in this repository
3. Click **"Sync to Monday.com Repository"** → **"Run workflow"**
4. Check if a PR is created in `dapulse-homepage-react`

### Test 2: Commit Test
1. Make a small change (e.g., edit README.md)
2. Commit and push to `main`
3. Check **Actions** tab to see workflow progress
4. Verify PR creation in target repository

## 🚨 Troubleshooting

### Common Issues:
- **"Repository not found"**: Check token permissions and repository name
- **"Authentication failed"**: Regenerate and update the `MONDAY_GITHUB_TOKEN` secret
- **"No changes detected"**: Workflow only creates PRs when files actually change
- **"Branch not found"**: The workflow will create the `monday-for-agents` branch if it doesn't exist

### Support
If you encounter issues:
1. Check the **Actions** tab for detailed error logs
2. Verify the token has `repo` permissions
3. Ensure you can manually access `DaPulse/dapulse-homepage-react`

## 📊 Workflow Status

Once set up, you'll see:
- ✅ Green checkmarks on commits when sync succeeds
- 📝 Automatic PR creation in target repository
- 🔗 Links to created PRs in the workflow logs
- 📧 GitHub notifications for PR assignments

---

*This setup enables seamless content synchronization from development to staging!* 🎉