# Backend Setup Guide - Node.js + Express + MongoDB

This guide provides the complete backend structure for the KYC Document Management System.

## 📁 Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary config
│   │   └── email.js              # Email config
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Organization.js       # Organization schema
│   │   ├── Document.js           # Document schema
│   │   └── AuditLog.js           # Audit log schema
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── documentController.js # Document logic
│   │   ├── analyticsController.js# Analytics logic
│   │   ├── organizationController.js
│   │   └── auditLogController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── rbac.js               # Role-based access
│   │   ├── upload.js             # Multer config
│   │   ├── rateLimit.js          # Rate limiting
│   │   └── errorHandler.js       # Error handling
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── documents.js          # Document routes
│   │   ├── analytics.js          # Analytics routes
│   │   ├── organizations.js      # Org routes
│   │   └── auditLogs.js          # Audit routes
│   ├── services/
│   │   ├── ocrService.js         # Tesseract OCR
│   │   ├── fraudDetection.js    # Fraud detection
│   │   ├── emailService.js       # Email notifications
│   │   └── cloudinaryService.js  # File upload
│   ├── utils/
│   │   ├── jwt.js                # JWT helpers
│   │   ├── validators.js         # Input validation
│   │   └── helpers.js            # Utility functions
│   └── app.js                    # Express app
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── package.json
└── server.js                     # Entry point
```

## 🗄️ MongoDB Schemas

### User Schema
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'organization', 'user'],
    default: 'user'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1, organizationId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Organization Schema
```javascript
// models/Organization.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  apiKey: {
    type: String,
    unique: true
  },
  apiKeyHash: String,
  status: {
    type: String,
    enum: ['active', 'suspended', 'trial'],
    default: 'active'
  },
  uploadLimit: {
    type: Number,
    default: 100
  },
  uploadsUsed: {
    type: Number,
    default: 0
  },
  usersCount: {
    type: Number,
    default: 0
  },
  documentsCount: {
    type: Number,
    default: 0
  },
  stripeCustomerId: String,
  subscriptionId: String,
  subscriptionStatus: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate API key
organizationSchema.methods.generateApiKey = function() {
  const apiKey = 'sk_' + crypto.randomBytes(32).toString('hex');
  this.apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return apiKey;
};

// Verify API key
organizationSchema.methods.verifyApiKey = function(apiKey) {
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return hash === this.apiKeyHash;
};

module.exports = mongoose.model('Organization', organizationSchema);
```

### Document Schema
```javascript
// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ['PAN Card', 'Aadhar Card', 'Passport', 'Driving License', 'Other'],
    required: true
  },
  fileName: String,
  fileUrl: String,
  cloudinaryId: String,
  fileSize: Number,
  mimeType: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  ocrData: {
    extractedText: String,
    confidence: Number,
    processed: Boolean,
    entities: mongoose.Schema.Types.Mixed
  },
  fraudScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  fraudFlags: [String],
  rejectionReason: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
documentSchema.index({ organizationId: 1, status: 1 });
documentSchema.index({ organizationId: 1, createdAt: -1 });
documentSchema.index({ userEmail: 1 });
documentSchema.index({ documentType: 1 });

module.exports = mongoose.model('Document', documentSchema);
```

### AuditLog Schema
```javascript
// models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String,
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'DOCUMENT_UPLOADED',
      'DOCUMENT_APPROVED',
      'DOCUMENT_REJECTED',
      'DOCUMENT_DELETED',
      'SETTINGS_UPDATED',
      'API_KEY_GENERATED',
      'USER_CREATED',
      'USER_DELETED'
    ]
  },
  resource: String,
  resourceId: mongoose.Schema.Types.ObjectId,
  details: String,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for querying
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
```

## 🔌 API Endpoints

### Authentication Routes
```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validators');

// POST /api/auth/register
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me
router.get('/me', authController.getMe);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

module.exports = router;
```

### Document Routes
```javascript
// routes/documents.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/documents
router.get('/', authenticate, documentController.getDocuments);

// POST /api/documents/upload
router.post('/upload', authenticate, upload.single('file'), documentController.uploadDocument);

// GET /api/documents/:id
router.get('/:id', authenticate, documentController.getDocument);

// PATCH /api/documents/:id/status
router.patch('/:id/status', authenticate, authorize(['admin', 'organization']), documentController.updateStatus);

// DELETE /api/documents/:id
router.delete('/:id', authenticate, authorize(['admin']), documentController.deleteDocument);

// POST /api/documents/:id/process-ocr
router.post('/:id/process-ocr', authenticate, documentController.processOCR);

module.exports = router;
```

## 🔑 Middleware

### Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

exports.verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }

    const Organization = require('../models/Organization');
    const orgs = await Organization.find();
    
    let validOrg = null;
    for (const org of orgs) {
      if (org.verifyApiKey(apiKey)) {
        validOrg = org;
        break;
      }
    }

    if (!validOrg) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    req.organization = validOrg;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid API key' });
  }
};
```

### File Upload Middleware
```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
```

### Rate Limiting
```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.'
});
```

## 🎯 Services

### OCR Service
```javascript
// services/ocrService.js
const Tesseract = require('tesseract.js');

exports.processDocument = async (imagePath) => {
  try {
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(m) }
    );

    const entities = extractEntities(text);

    return {
      extractedText: text,
      confidence: confidence / 100,
      entities,
      processed: true
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
};

function extractEntities(text) {
  const entities = {};

  // PAN Card pattern
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
  const panMatch = text.match(panRegex);
  if (panMatch) entities.panNumber = panMatch[0];

  // Aadhar pattern
  const aadharRegex = /\d{4}\s\d{4}\s\d{4}/g;
  const aadharMatch = text.match(aadharRegex);
  if (aadharMatch) entities.aadharNumber = aadharMatch[0];

  // Passport pattern
  const passportRegex = /[A-Z]{1}[0-9]{7}/g;
  const passportMatch = text.match(passportRegex);
  if (passportMatch) entities.passportNumber = passportMatch[0];

  return entities;
}
```

### Fraud Detection Service
```javascript
// services/fraudDetection.js
const crypto = require('crypto');
const Document = require('../models/Document');

exports.calculateFraudScore = async (document, fileBuffer) => {
  let score = 0;
  const flags = [];

  // Check for duplicate documents
  const fileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');
  const duplicate = await Document.findOne({
    organizationId: document.organizationId,
    fileHash: fileHash,
    _id: { $ne: document._id }
  });

  if (duplicate) {
    score += 0.5;
    flags.push('DUPLICATE_DOCUMENT');
  }

  // Check file size anomalies
  if (document.fileSize < 10000) {
    score += 0.2;
    flags.push('SUSPICIOUSLY_SMALL_FILE');
  }

  // Check OCR confidence
  if (document.ocrData?.confidence < 0.5) {
    score += 0.3;
    flags.push('LOW_OCR_CONFIDENCE');
  }

  // Additional checks can be added here

  return {
    fraudScore: Math.min(score, 1),
    fraudFlags: flags
  };
};
```

### Email Service
```javascript
// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendDocumentApprovalEmail = async (userEmail, documentDetails) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Document Approved - KYC Manager',
    html: `
      <h2>Your document has been approved</h2>
      <p>Document Type: ${documentDetails.documentType}</p>
      <p>Status: Approved</p>
      <p>Thank you for your submission.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.sendDocumentRejectionEmail = async (userEmail, documentDetails, reason) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Document Rejected - KYC Manager',
    html: `
      <h2>Your document has been rejected</h2>
      <p>Document Type: ${documentDetails.documentType}</p>
      <p>Reason: ${reason}</p>
      <p>Please upload a valid document.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
```

## 🌍 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kycmanager

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=KYC Manager <noreply@kycmanager.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🚀 Deployment

### Deploy to Render

1. Create `render.yaml`:
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
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
```

2. Push to GitHub and connect to Render

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Deploy:
```bash
railway login
railway init
railway up
```

## 📝 Notes

- Always use environment variables for sensitive data
- Implement proper error handling
- Add request validation
- Use HTTPS in production
- Enable CORS for frontend domain only
- Implement logging (Winston, Morgan)
- Add database backups
- Monitor with tools like PM2, New Relic
- Use Redis for session management (optional)
- Implement webhook handling for Stripe

## 🔒 Security Best Practices

1. Use helmet.js for HTTP headers
2. Implement CORS properly
3. Sanitize user inputs
4. Use parameterized queries
5. Implement rate limiting
6. Hash sensitive data
7. Use HTTPS only
8. Regular security audits
9. Keep dependencies updated
10. Implement proper logging

---

This backend structure is production-ready and scalable!
