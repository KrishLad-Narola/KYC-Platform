// Mock data for the KYC Document Management System

export const mockDocuments = [
  {
    id: 'doc_001',
    organizationId: 'org_123',
    userId: 'user_001',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    documentType: 'PAN Card',
    fileName: 'pan_john_doe.pdf',
    fileUrl: 'https://example.com/docs/pan_john_doe.pdf',
    fileSize: 245678,
    status: 'approved',
    ocrData: {
      extractedText: 'PERMANENT ACCOUNT NUMBER CARD',
      panNumber: 'ABCDE1234F',
      name: 'JOHN DOE',
      dateOfBirth: '01/01/1990'
    },
    fraudScore: 0.05,
    uploadedAt: new Date('2026-04-15T10:30:00'),
    updatedAt: new Date('2026-04-16T14:20:00'),
    reviewedBy: 'admin@kyc.com'
  },
  {
    id: 'doc_002',
    organizationId: 'org_123',
    userId: 'user_002',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    documentType: 'Aadhar Card',
    fileName: 'aadhar_jane_smith.jpg',
    fileUrl: 'https://example.com/docs/aadhar_jane_smith.jpg',
    fileSize: 189234,
    status: 'pending',
    ocrData: {
      extractedText: 'Government of India',
      aadharNumber: '1234 5678 9012',
      name: 'Jane Smith',
      address: '123 Main Street, Mumbai'
    },
    fraudScore: 0.12,
    uploadedAt: new Date('2026-04-20T09:15:00'),
    updatedAt: new Date('2026-04-20T09:15:00'),
    reviewedBy: null
  },
  {
    id: 'doc_003',
    organizationId: 'org_123',
    userId: 'user_003',
    userName: 'Michael Johnson',
    userEmail: 'michael@example.com',
    documentType: 'Passport',
    fileName: 'passport_michael.pdf',
    fileUrl: 'https://example.com/docs/passport_michael.pdf',
    fileSize: 512000,
    status: 'approved',
    ocrData: {
      extractedText: 'PASSPORT',
      passportNumber: 'K1234567',
      name: 'MICHAEL JOHNSON',
      nationality: 'Indian'
    },
    fraudScore: 0.03,
    uploadedAt: new Date('2026-04-18T14:45:00'),
    updatedAt: new Date('2026-04-19T11:30:00'),
    reviewedBy: 'admin@kyc.com'
  },
  {
    id: 'doc_004',
    organizationId: 'org_123',
    userId: 'user_004',
    userName: 'Sarah Williams',
    userEmail: 'sarah@example.com',
    documentType: 'Driving License',
    fileName: 'dl_sarah.jpg',
    fileUrl: 'https://example.com/docs/dl_sarah.jpg',
    fileSize: 156789,
    status: 'rejected',
    ocrData: {
      extractedText: 'Driving License',
      licenseNumber: 'DL-1234567890123',
      name: 'Sarah Williams',
      issueDate: '01/01/2020'
    },
    fraudScore: 0.75,
    rejectionReason: 'Document appears to be tampered',
    uploadedAt: new Date('2026-04-22T16:20:00'),
    updatedAt: new Date('2026-04-23T10:15:00'),
    reviewedBy: 'admin@kyc.com'
  },
  {
    id: 'doc_005',
    organizationId: 'org_123',
    userId: 'user_005',
    userName: 'David Brown',
    userEmail: 'david@example.com',
    documentType: 'PAN Card',
    fileName: 'pan_david.pdf',
    fileUrl: 'https://example.com/docs/pan_david.pdf',
    fileSize: 234567,
    status: 'pending',
    ocrData: {
      extractedText: 'PERMANENT ACCOUNT NUMBER',
      panNumber: 'FGHIJ5678K',
      name: 'DAVID BROWN',
      dateOfBirth: '15/06/1985'
    },
    fraudScore: 0.08,
    uploadedAt: new Date('2026-04-25T11:30:00'),
    updatedAt: new Date('2026-04-25T11:30:00'),
    reviewedBy: null
  }
];

export const mockOrganizations = [
  {
    id: 'org_123',
    name: 'Demo Corporation',
    email: 'contact@democorp.com',
    plan: 'pro',
    apiKey: 'sk_test_democorp123',
    documentsCount: 234,
    usersCount: 45,
    uploadLimit: 1000,
    uploadsUsed: 234,
    createdAt: new Date('2025-01-15'),
    status: 'active'
  },
  {
    id: 'org_124',
    name: 'Tech Startup Inc',
    email: 'admin@techstartup.com',
    plan: 'enterprise',
    apiKey: 'sk_test_techstartup456',
    documentsCount: 1567,
    usersCount: 123,
    uploadLimit: -1, // unlimited
    uploadsUsed: 1567,
    createdAt: new Date('2024-06-20'),
    status: 'active'
  },
  {
    id: 'org_125',
    name: 'Small Business LLC',
    email: 'info@smallbiz.com',
    plan: 'free',
    apiKey: 'sk_test_smallbiz789',
    documentsCount: 45,
    usersCount: 5,
    uploadLimit: 100,
    uploadsUsed: 45,
    createdAt: new Date('2026-03-10'),
    status: 'active'
  }
];

export const mockAuditLogs = [
  {
    id: 'log_001',
    organizationId: 'org_123',
    userId: 'user_001',
    userName: 'Admin User',
    action: 'DOCUMENT_APPROVED',
    resource: 'doc_001',
    details: 'Approved PAN Card for John Doe',
    ipAddress: '192.168.1.1',
    timestamp: new Date('2026-04-16T14:20:00')
  },
  {
    id: 'log_002',
    organizationId: 'org_123',
    userId: 'user_001',
    userName: 'Admin User',
    action: 'LOGIN',
    resource: 'auth',
    details: 'Successful login',
    ipAddress: '192.168.1.1',
    timestamp: new Date('2026-04-16T09:00:00')
  },
  {
    id: 'log_003',
    organizationId: 'org_123',
    userId: 'user_002',
    userName: 'Jane Smith',
    action: 'DOCUMENT_UPLOADED',
    resource: 'doc_002',
    details: 'Uploaded Aadhar Card',
    ipAddress: '192.168.1.5',
    timestamp: new Date('2026-04-20T09:15:00')
  },
  {
    id: 'log_004',
    organizationId: 'org_123',
    userId: 'user_001',
    userName: 'Admin User',
    action: 'DOCUMENT_REJECTED',
    resource: 'doc_004',
    details: 'Rejected Driving License for Sarah Williams - Document appears to be tampered',
    ipAddress: '192.168.1.1',
    timestamp: new Date('2026-04-23T10:15:00')
  }
];

export const mockAnalytics = {
  overview: {
    totalDocuments: 234,
    pendingReviews: 12,
    approvedDocuments: 198,
    rejectedDocuments: 24,
    avgProcessingTime: '4.5 hours',
    fraudDetectionRate: '10.2%'
  },
  monthlyTrends: [
    { month: 'Jan', uploads: 45, approved: 38, rejected: 7 },
    { month: 'Feb', uploads: 52, approved: 44, rejected: 8 },
    { month: 'Mar', uploads: 61, approved: 53, rejected: 8 },
    { month: 'Apr', uploads: 76, approved: 63, rejected: 13 }
  ],
  statusDistribution: [
    { name: 'Approved', value: 198, color: '#10b981' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Rejected', value: 24, color: '#ef4444' }
  ],
  documentTypes: [
    { type: 'PAN Card', count: 89 },
    { type: 'Aadhar Card', count: 78 },
    { type: 'Passport', count: 45 },
    { type: 'Driving License', count: 22 }
  ]
};

export const planLimits = {
  free: {
    name: 'Free',
    price: 0,
    uploadLimit: 100,
    users: 5,
    storage: '1 GB',
    support: 'Email',
    features: ['Basic OCR', 'Email Notifications', 'API Access']
  },
  pro: {
    name: 'Pro',
    price: 99,
    uploadLimit: 1000,
    users: 50,
    storage: '10 GB',
    support: 'Priority Email',
    features: ['Advanced OCR', 'Fraud Detection', 'Analytics Dashboard', 'API Access', 'Email Notifications', 'Custom Branding']
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    uploadLimit: -1, // unlimited
    users: -1, // unlimited
    storage: 'Unlimited',
    support: '24/7 Phone & Email',
    features: ['Everything in Pro', 'Custom Integration', 'Dedicated Support', 'SLA Guarantee', 'White Label Solution', 'Advanced Analytics']
  }
};
