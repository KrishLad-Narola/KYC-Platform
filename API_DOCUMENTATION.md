# API Documentation - KYC Manager

Complete API reference for the KYC Document Management System.

## Base URL
```
Production: https://api.kycmanager.com/api
Development: http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

For API key authentication (external integrations):
```
X-API-Key: sk_your_api_key_here
```

---

## 📋 Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Documents](#document-endpoints)
3. [Analytics](#analytics-endpoints)
4. [Organizations](#organization-endpoints)
5. [Audit Logs](#audit-log-endpoints)
6. [Error Responses](#error-responses)

---

## Authentication Endpoints

### Register Organization

Create a new organization account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "organizationName": "ACME Corp"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "organization",
      "organizationId": "60d5ec49f1b2c72b8c8e4f1b"
    },
    "organization": {
      "id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "ACME Corp",
      "plan": "free",
      "apiKey": "sk_test_abc123..."
    }
  }
}
```

**Errors:**
- `400` - Validation error
- `409` - Email already exists

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "organization",
      "organizationId": "60d5ec49f1b2c72b8c8e4f1b"
    }
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - Account suspended

---

### Get Current User

Get authenticated user details.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "organization",
    "organizationId": "60d5ec49f1b2c72b8c8e4f1b",
    "organization": {
      "name": "ACME Corp",
      "plan": "pro",
      "uploadsUsed": 45,
      "uploadLimit": 1000
    }
  }
}
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Document Endpoints

### Upload Document

Upload a new KYC document for processing.

**Endpoint:** `POST /documents/upload`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
userName: "Jane Smith"
userEmail: "jane@example.com"
documentType: "PAN Card"
file: [binary file]
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1c",
    "organizationId": "60d5ec49f1b2c72b8c8e4f1b",
    "userName": "Jane Smith",
    "userEmail": "jane@example.com",
    "documentType": "PAN Card",
    "fileName": "pan_card_jane.pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "fileSize": 245678,
    "status": "pending",
    "fraudScore": 0.05,
    "uploadedAt": "2026-04-30T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` - Invalid file type or size
- `403` - Upload limit exceeded
- `413` - File too large (max 5MB)

---

### Get Documents

Retrieve documents with filtering and pagination.

**Endpoint:** `GET /documents`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
status: "pending" | "approved" | "rejected" | "all" (default: "all")
documentType: "PAN Card" | "Aadhar Card" | "Passport" | "Driving License" | "all" (default: "all")
search: string (searches in userName, userEmail, fileName)
page: number (default: 1)
limit: number (default: 10, max: 100)
sortBy: "uploadedAt" | "updatedAt" (default: "uploadedAt")
sortOrder: "asc" | "desc" (default: "desc")
```

**Example Request:**
```
GET /documents?status=pending&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "60d5ec49f1b2c72b8c8e4f1c",
        "userName": "Jane Smith",
        "userEmail": "jane@example.com",
        "documentType": "PAN Card",
        "fileName": "pan_card.pdf",
        "fileUrl": "https://res.cloudinary.com/...",
        "fileSize": 245678,
        "status": "pending",
        "fraudScore": 0.05,
        "uploadedAt": "2026-04-30T10:30:00.000Z",
        "updatedAt": "2026-04-30T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Single Document

Get details of a specific document.

**Endpoint:** `GET /documents/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1c",
    "organizationId": "60d5ec49f1b2c72b8c8e4f1b",
    "userName": "Jane Smith",
    "userEmail": "jane@example.com",
    "documentType": "PAN Card",
    "fileName": "pan_card.pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "fileSize": 245678,
    "status": "approved",
    "ocrData": {
      "extractedText": "PERMANENT ACCOUNT NUMBER...",
      "confidence": 0.95,
      "entities": {
        "panNumber": "ABCDE1234F",
        "name": "JANE SMITH",
        "dateOfBirth": "01/01/1990"
      },
      "processed": true
    },
    "fraudScore": 0.05,
    "fraudFlags": [],
    "reviewedBy": "60d5ec49f1b2c72b8c8e4f1a",
    "reviewedAt": "2026-04-30T14:20:00.000Z",
    "uploadedAt": "2026-04-30T10:30:00.000Z",
    "updatedAt": "2026-04-30T14:20:00.000Z"
  }
}
```

**Errors:**
- `404` - Document not found
- `403` - Access denied (different organization)

---

### Update Document Status

Approve or reject a document.

**Endpoint:** `PATCH /documents/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Permissions:** `admin`, `organization`

**Request Body:**
```json
{
  "status": "approved",
  "rejectionReason": "Document appears to be tampered" // Required if status is "rejected"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1c",
    "status": "approved",
    "reviewedBy": "60d5ec49f1b2c72b8c8e4f1a",
    "reviewedAt": "2026-04-30T14:20:00.000Z",
    "updatedAt": "2026-04-30T14:20:00.000Z"
  },
  "message": "Document approved successfully. Email notification sent."
}
```

**Errors:**
- `400` - Invalid status or missing rejection reason
- `403` - Insufficient permissions
- `404` - Document not found

---

### Delete Document

Delete a document (admin only).

**Endpoint:** `DELETE /documents/:id`

**Headers:** `Authorization: Bearer <token>`

**Permissions:** `admin`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### Process OCR

Trigger OCR processing for a document.

**Endpoint:** `POST /documents/:id/process-ocr`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "ocrData": {
      "extractedText": "PERMANENT ACCOUNT NUMBER...",
      "confidence": 0.95,
      "entities": {
        "panNumber": "ABCDE1234F",
        "name": "JANE SMITH"
      },
      "processed": true
    }
  }
}
```

---

## Analytics Endpoints

### Get Dashboard Analytics

Get overview analytics for dashboard.

**Endpoint:** `GET /analytics/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalDocuments": 234,
      "pendingReviews": 12,
      "approvedDocuments": 198,
      "rejectedDocuments": 24,
      "avgProcessingTime": "4.5 hours",
      "fraudDetectionRate": "10.2%"
    },
    "monthlyTrends": [
      {
        "month": "Jan",
        "uploads": 45,
        "approved": 38,
        "rejected": 7
      },
      {
        "month": "Feb",
        "uploads": 52,
        "approved": 44,
        "rejected": 8
      }
    ],
    "statusDistribution": [
      { "name": "Approved", "value": 198 },
      { "name": "Pending", "value": 12 },
      { "name": "Rejected", "value": 24 }
    ],
    "documentTypes": [
      { "type": "PAN Card", "count": 89 },
      { "type": "Aadhar Card", "count": 78 },
      { "type": "Passport", "count": 45 },
      { "type": "Driving License", "count": 22 }
    ]
  }
}
```

---

### Get Monthly Trends

Get detailed monthly upload trends.

**Endpoint:** `GET /analytics/trends`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
startDate: ISO date string (default: 6 months ago)
endDate: ISO date string (default: today)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "month": "2026-01",
        "uploads": 45,
        "approved": 38,
        "rejected": 7,
        "avgProcessingTime": 4.2,
        "approvalRate": 84.4
      }
    ]
  }
}
```

---

## Organization Endpoints

### Get Organizations (Admin Only)

List all organizations.

**Endpoint:** `GET /organizations`

**Headers:** `Authorization: Bearer <token>`

**Permissions:** `admin`

**Query Parameters:**
```
search: string
plan: "free" | "pro" | "enterprise" | "all"
status: "active" | "suspended" | "trial" | "all"
page: number
limit: number
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "60d5ec49f1b2c72b8c8e4f1b",
        "name": "ACME Corp",
        "email": "contact@acme.com",
        "plan": "pro",
        "status": "active",
        "usersCount": 45,
        "documentsCount": 234,
        "uploadsUsed": 234,
        "uploadLimit": 1000,
        "createdAt": "2025-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### Update Organization (Admin Only)

Update organization details.

**Endpoint:** `PATCH /organizations/:id`

**Headers:** `Authorization: Bearer <token>`

**Permissions:** `admin`

**Request Body:**
```json
{
  "name": "ACME Corporation",
  "plan": "enterprise",
  "status": "active",
  "uploadLimit": -1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4f1b",
    "name": "ACME Corporation",
    "plan": "enterprise",
    "status": "active",
    "uploadLimit": -1,
    "updatedAt": "2026-04-30T15:00:00.000Z"
  }
}
```

---

### Regenerate API Key

Generate a new API key for organization.

**Endpoint:** `POST /organizations/:id/regenerate-api-key`

**Headers:** `Authorization: Bearer <token>`

**Permissions:** `admin`, `organization` (own org only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "apiKey": "sk_test_new_key_abc123..."
  },
  "message": "API key regenerated successfully. Please store it securely."
}
```

---

## Audit Log Endpoints

### Get Audit Logs

Retrieve audit logs with filtering.

**Endpoint:** `GET /audit-logs`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
action: "LOGIN" | "LOGOUT" | "DOCUMENT_UPLOADED" | etc.
userId: ObjectId
startDate: ISO date string
endDate: ISO date string
page: number
limit: number
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60d5ec49f1b2c72b8c8e4f1d",
        "organizationId": "60d5ec49f1b2c72b8c8e4f1b",
        "userId": "60d5ec49f1b2c72b8c8e4f1a",
        "userName": "Admin User",
        "action": "DOCUMENT_APPROVED",
        "resource": "document",
        "resourceId": "60d5ec49f1b2c72b8c8e4f1c",
        "details": "Approved PAN Card for Jane Smith",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2026-04-30T14:20:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

## Error Responses

All error responses follow this format:

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token"
  }
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Insufficient permissions to access this resource"
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Rate Limit (429)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limits

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP
- **File upload**: 10 uploads per hour per organization

---

## Webhooks

Subscribe to events by configuring webhook URLs in your organization settings.

### Webhook Events

- `document.uploaded`
- `document.approved`
- `document.rejected`
- `subscription.updated`
- `payment.succeeded`
- `payment.failed`

### Webhook Payload Format
```json
{
  "event": "document.approved",
  "timestamp": "2026-04-30T14:20:00.000Z",
  "data": {
    "documentId": "60d5ec49f1b2c72b8c8e4f1c",
    "status": "approved",
    "reviewedBy": "admin@example.com"
  }
}
```

---

## SDKs and Client Libraries

- **JavaScript/Node.js**: `npm install kyc-manager-sdk`
- **Python**: `pip install kyc-manager`
- **PHP**: `composer require kyc-manager/sdk`

### Example Usage (Node.js)
```javascript
const KYCManager = require('kyc-manager-sdk');

const client = new KYCManager({
  apiKey: 'sk_test_your_api_key'
});

// Upload document
const document = await client.documents.upload({
  userName: 'Jane Smith',
  userEmail: 'jane@example.com',
  documentType: 'PAN Card',
  file: fs.createReadStream('pan_card.pdf')
});

// Get documents
const documents = await client.documents.list({
  status: 'pending',
  page: 1,
  limit: 10
});
```

---

**For support or questions, contact: api-support@kycmanager.com**
