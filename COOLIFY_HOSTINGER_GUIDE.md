# HEARTLINK — Hostinger VPS & Coolify Deployment Guide

This guide explains how to deploy **HEARTLINK** onto your **Hostinger VPS** using **Coolify** and **GitHub**.

---

## 🏗️ Architecture Overview

```
┌────────────────┐      git push       ┌───────────────┐      Webhook      ┌───────────────────────────┐
│ Local Computer │ ──────────────────> │ GitHub Repo   │ ────────────────> │ Hostinger VPS (Coolify)   │
│ (HEARTLINK)    │                     │ (heartlink)   │                   │ • Auto Docker Build       │
└────────────────┘                     └───────────────┘                   │ • Traefik Reverse Proxy   │
                                                                           │ • Free Auto SSL (HTTPS)   │
                                                                           │ • 24/7 Persistent Storage │
                                                                           └─────────────┬─────────────┘
                                                                                         │
                                                                                         ▼
                                                                           https://yourdomain.com
```

---

## 📋 STEP 1: Push Code to Your GitHub Repository

1. Go to [github.com/new](https://github.com/new) and create a new repository:
   - **Repository name**: `heartlink`
   - **Privacy**: Private (recommended) or Public
   - **Do NOT check** "Initialize with README" (we already have everything committed).

2. In your computer terminal / command prompt, run:
   ```bash
   cd C:\Users\user\.gemini\antigravity\scratch\heartlink
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/heartlink.git
   git branch -M main
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` with your real GitHub username).*

---

## 🚀 STEP 2: Deploy in Coolify (On Hostinger VPS)

1. Open your **Coolify Dashboard** in your browser:
   (Usually at `http://YOUR_VPS_IP:8000` or your Coolify domain).
2. Go to **Projects** → Select your Project (or click **+ New Project**).
3. Select your **Environment** (e.g., `Production`).
4. Click **+ New Resource** → Select **Public/Private Repository** (or GitHub App).
5. Paste your repository URL:
   `https://github.com/YOUR_GITHUB_USERNAME/heartlink`
   - **Branch**: `main`
   - **Build Pack**: **Docker Compose** (or **Dockerfile**)
     *(Coolify will automatically detect `docker-compose.yml` and `Dockerfile`)*.
6. Click **Save**.

---

## ⚙️ STEP 3: Configure Domain & Environment Variables

### 1. Set Your Domain
In the Coolify Application settings:
- **Domains**: Enter your domain or subdomain:
  - Example: `https://heartlink.yourdomain.com` or `https://yourdomain.com`
- Coolify automatically configures **Traefik** and provisions a **free Let's Encrypt SSL certificate**!
*(Make sure your domain's DNS `A Record` points to your Hostinger VPS IP address).*

### 2. Environment Variables
In the **Environment Variables** tab in Coolify, add:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-random-super-secure-production-secret-key-2026
```
*(Optional: If you want Google Gemini AI Cupid live processing, add `GEMINI_API_KEY=your_key_here`).*

### 3. Persistent Storage (Automatic)
Because we included `docker-compose.yml`, Coolify will automatically mount a persistent volume for `/app/data`.
This ensures that all registered users, chat messages, and match history are **never lost** when you push new updates or redeploy!

---

## 🚢 STEP 4: Click "Deploy"

1. Click the **Deploy** button in the top right corner of Coolify.
2. Coolify will:
   - Clone your GitHub repo
   - Build the Next.js production container
   - Start the container on port 3000
   - Route traffic through HTTPS
3. In 2 to 3 minutes, your site will be live at `https://yourdomain.com`!

---

## 🔄 Automatic Continuous Deployment (CI/CD)

Whenever you make changes in the future and run:
```bash
git add .
git commit -m "Update feature"
git push
```
Coolify's GitHub webhook will automatically pull the latest code, rebuild the container, and deploy it with **zero downtime**!
