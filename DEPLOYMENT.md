# Deployment Guide - KYC Manager

Complete guide for deploying your KYC Document Management System to production.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Backend API is ready
- [ ] Database is set up
- [ ] Domain name acquired (optional)
- [ ] SSL certificate ready (auto with Vercel/Netlify)
- [ ] Email service configured
- [ ] Payment gateway set up (if applicable)

---

## 🚀 Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Automatic deployments from Git
- ✅ Free SSL certificates
- ✅ Edge network (fast globally)
- ✅ Zero configuration for Vite
- ✅ Free tier available

**Steps:**

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kyc-manager.git
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Framework Preset: Vite (auto-detected)
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-api.com/api
     VITE_ENV=production
     ```

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as shown

**Deployment URL:** `https://your-project.vercel.app`

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Or use Netlify UI**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop your `dist` folder
   - Or connect Git repository

5. **Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add your variables

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update vite.config.ts**
```javascript
export default defineConfig({
  base: '/kyc-manager/',
  // ... rest of config
})
```

3. **Add deploy script to package.json**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

**URL:** `https://yourusername.github.io/kyc-manager/`

---

## 🖥️ Backend Deployment

### Option 1: Render (Recommended)

**Why Render?**
- ✅ Free tier with 750 hours/month
- ✅ Automatic deployments
- ✅ Built-in SSL
- ✅ Easy environment variables
- ✅ Good for Node.js apps

**Steps:**

1. **Create render.yaml** in backend root:
```yaml
services:
  - type: web
    name: kyc-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

2. **Deploy**
   - Go to [render.com](https://render.com)
   - Create New → Web Service
   - Connect GitHub repository
   - Render auto-detects settings
   - Add environment variables
   - Click "Create Web Service"

3. **Configure Environment Variables**
   - Go to your service → Environment
   - Add all required variables from `.env.example`

**Backend URL:** `https://your-service.onrender.com`

---

### Option 2: Railway

**Steps:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Deploy**
```bash
railway up
```

4. **Add Environment Variables**
```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-secret"
```

**Or use Railway UI:**
- Go to [railway.app](https://railway.app)
- New Project → Deploy from GitHub
- Add environment variables
- Deploy

---

### Option 3: Heroku

**Steps:**

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create kyc-backend
```

3. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET="your-secret"
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloud"
```

5. **Deploy**
```bash
git push heroku main
```

---

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

**Steps:**

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select region closest to your backend
   - Create cluster (takes 5-10 min)

3. **Create Database User**
   - Database Access → Add New User
   - Choose username & password
   - Select "Read and write to any database"

4. **Configure Network Access**
   - Network Access → Add IP Address
   - For development: "Allow Access from Anywhere"
   - For production: Add your server IPs

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with your database name

**Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kycmanager?retryWrites=true&w=majority
```

6. **Add to Backend Environment**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kycmanager
```

---

## 📁 File Storage Setup

### Option 1: Cloudinary (Recommended)

**Steps:**

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free (25GB storage)

2. **Get Credentials**
   - Dashboard → Account Details
   - Copy:
     - Cloud Name
     - API Key
     - API Secret

3. **Add to Backend Environment**
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Configure Upload Preset**
   - Settings → Upload → Upload presets
   - Create unsigned preset for frontend uploads

---

### Option 2: AWS S3

**Steps:**

1. **Create AWS Account**
   - Sign up at [aws.amazon.com](https://aws.amazon.com)

2. **Create S3 Bucket**
   - S3 → Create Bucket
   - Choose unique name
   - Select region
   - Uncheck "Block all public access" (for public files)

3. **Create IAM User**
   - IAM → Users → Add User
   - Enable programmatic access
   - Attach policy: `AmazonS3FullAccess`
   - Save Access Key ID & Secret

4. **Add to Backend Environment**
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

---

## 📧 Email Service Setup

### Option 1: SendGrid

**Steps:**

1. **Create Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up (100 emails/day free)

2. **Create API Key**
   - Settings → API Keys → Create API Key
   - Full Access
   - Copy API key

3. **Verify Sender**
   - Settings → Sender Authentication
   - Verify email address or domain

4. **Add to Backend Environment**
```bash
SENDGRID_API_KEY=your-api-key
SMTP_FROM=noreply@yourdomain.com
```

---

### Option 2: Gmail SMTP

**Steps:**

1. **Enable 2-Factor Authentication**
   - Google Account → Security → 2-Step Verification

2. **Create App Password**
   - Google Account → Security → App passwords
   - Select app: Mail, device: Other
   - Copy generated password

3. **Add to Backend Environment**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

---

## 💳 Payment Integration (Optional)

### Stripe Setup

**Steps:**

1. **Create Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up

2. **Get API Keys**
   - Developers → API keys
   - Copy:
     - Publishable key (for frontend)
     - Secret key (for backend)

3. **Add to Environment**

**Frontend (.env):**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend (.env):**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Create Products & Prices**
   - Products → Add Product
   - Create for Free, Pro, Enterprise plans

---

## 🔐 Security Configuration

### 1. Environment Variables

**Never commit:**
- ❌ `.env` files
- ❌ API keys
- ❌ Database credentials
- ❌ Secret tokens

**Add to `.gitignore`:**
```
.env
.env.local
.env.production
```

### 2. CORS Configuration (Backend)

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

### 3. Helmet.js (Backend)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Rate Limiting (Backend)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📊 Monitoring & Analytics

### 1. Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Sentry (Error Tracking)

**Install:**
```bash
npm install @sentry/react
```

**Configure:**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responsive
- [ ] Database connected successfully
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Authentication functioning
- [ ] API endpoints responding
- [ ] HTTPS enabled (SSL)
- [ ] Environment variables set
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Domain configured (if applicable)
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

**Environment variables not working:**
- Must prefix with `VITE_`
- Restart dev server after changes
- Check `.env` file location (root directory)

### Backend Issues

**Can't connect to MongoDB:**
- Check connection string
- Verify network access in Atlas
- Ensure database user credentials are correct

**CORS errors:**
- Add frontend URL to CORS whitelist
- Include credentials: true if using cookies

**File upload fails:**
- Check storage service credentials
- Verify file size limits
- Ensure folder permissions

---

## 📞 Support

**Deployment Help:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Render: [render.com/docs](https://render.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

**Services:**
- MongoDB: [mongodb.com/docs/atlas](https://mongodb.com/docs/atlas)
- Cloudinary: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- Stripe: [stripe.com/docs](https://stripe.com/docs)

---

**Congratulations! Your KYC Manager is now live! 🎉**
