import { mockDocuments, mockOrganizations, mockAuditLogs, mockAnalytics } from './mockData';

// Mock API service - Replace with actual API calls to your Node.js backend
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  constructor() {
    this.documents = [...mockDocuments];
    this.organizations = [...mockOrganizations];
    this.auditLogs = [...mockAuditLogs];
  }

  // Auth endpoints
  async login(email, password) {
    await delay();
    // In production, make actual API call:
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // return response.json();
    
    return {
      success: true,
      token: 'jwt_mock_token',
      user: {
        id: '1',
        email,
        name: 'Demo User',
        role: email.includes('admin') ? 'admin' : 'organization'
      }
    };
  }

  async register(userData) {
    await delay();
    return {
      success: true,
      token: 'jwt_mock_token',
      user: {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role: 'organization'
      }
    };
  }

  // Document endpoints
  async uploadDocument(formData) {
    await delay();
    
    const newDocument = {
      id: 'doc_' + Math.random().toString(36).substr(2, 9),
      organizationId: 'org_123',
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      userName: formData.get('userName') || 'Unknown User',
      userEmail: formData.get('userEmail') || 'user@example.com',
      documentType: formData.get('documentType') || 'Other',
      fileName: formData.get('file')?.name || 'document.pdf',
      fileUrl: 'https://example.com/docs/' + formData.get('file')?.name,
      fileSize: formData.get('file')?.size || 0,
      status: 'pending',
      ocrData: {
        extractedText: 'Processing...',
        processed: false
      },
      fraudScore: Math.random() * 0.3,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      reviewedBy: null
    };

    this.documents.unshift(newDocument);
    
    return {
      success: true,
      document: newDocument
    };
  }

  async getDocuments(filters = {}) {
    await delay(300);
    
    let filteredDocs = [...this.documents];

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
    }

    if (filters.documentType && filters.documentType !== 'all') {
      filteredDocs = filteredDocs.filter(doc => doc.documentType === filters.documentType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDocs = filteredDocs.filter(doc =>
        doc.userName.toLowerCase().includes(searchLower) ||
        doc.userEmail.toLowerCase().includes(searchLower) ||
        doc.fileName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      success: true,
      documents: filteredDocs.slice(startIndex, endIndex),
      total: filteredDocs.length,
      page,
      totalPages: Math.ceil(filteredDocs.length / limit)
    };
  }

  async getDocument(id) {
    await delay(200);
    const document = this.documents.find(doc => doc.id === id);
    
    if (!document) {
      return { success: false, error: 'Document not found' };
    }

    return { success: true, document };
  }

  async updateDocumentStatus(id, status, reason = null) {
    await delay();
    
    const docIndex = this.documents.findIndex(doc => doc.id === id);
    
    if (docIndex === -1) {
      return { success: false, error: 'Document not found' };
    }

    this.documents[docIndex] = {
      ...this.documents[docIndex],
      status,
      rejectionReason: status === 'rejected' ? reason : null,
      updatedAt: new Date(),
      reviewedBy: 'admin@kyc.com'
    };

    // Add audit log
    this.auditLogs.unshift({
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      organizationId: 'org_123',
      userId: 'user_001',
      userName: 'Admin User',
      action: status === 'approved' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED',
      resource: id,
      details: `${status === 'approved' ? 'Approved' : 'Rejected'} ${this.documents[docIndex].documentType} for ${this.documents[docIndex].userName}`,
      ipAddress: '192.168.1.1',
      timestamp: new Date()
    });

    return {
      success: true,
      document: this.documents[docIndex]
    };
  }

  async deleteDocument(id) {
    await delay();
    
    const docIndex = this.documents.findIndex(doc => doc.id === id);
    
    if (docIndex === -1) {
      return { success: false, error: 'Document not found' };
    }

    this.documents.splice(docIndex, 1);

    return { success: true };
  }

  // Analytics endpoints
  async getAnalytics() {
    await delay(400);
    
    return {
      success: true,
      analytics: mockAnalytics
    };
  }

  async getMonthlyTrends() {
    await delay(300);
    
    return {
      success: true,
      trends: mockAnalytics.monthlyTrends
    };
  }

  // Organization endpoints
  async getOrganizations() {
    await delay(300);
    
    return {
      success: true,
      organizations: this.organizations
    };
  }

  async updateOrganization(id, data) {
    await delay();
    
    const orgIndex = this.organizations.findIndex(org => org.id === id);
    
    if (orgIndex === -1) {
      return { success: false, error: 'Organization not found' };
    }

    this.organizations[orgIndex] = {
      ...this.organizations[orgIndex],
      ...data,
      updatedAt: new Date()
    };

    return {
      success: true,
      organization: this.organizations[orgIndex]
    };
  }

  async regenerateApiKey(orgId) {
    await delay();
    
    const orgIndex = this.organizations.findIndex(org => org.id === orgId);
    
    if (orgIndex === -1) {
      return { success: false, error: 'Organization not found' };
    }

    const newApiKey = 'sk_test_' + Math.random().toString(36).substr(2, 16);
    this.organizations[orgIndex].apiKey = newApiKey;

    return {
      success: true,
      apiKey: newApiKey
    };
  }

  // Audit Log endpoints
  async getAuditLogs(filters = {}) {
    await delay(300);
    
    let filteredLogs = [...this.auditLogs];

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      success: true,
      logs: filteredLogs.slice(startIndex, endIndex),
      total: filteredLogs.length,
      page,
      totalPages: Math.ceil(filteredLogs.length / limit)
    };
  }

  // OCR Processing (mock)
  async processOCR(documentId) {
    await delay(1500); // Simulate OCR processing time
    
    const docIndex = this.documents.findIndex(doc => doc.id === documentId);
    
    if (docIndex === -1) {
      return { success: false, error: 'Document not found' };
    }

    // Mock OCR extraction
    const ocrData = {
      extractedText: 'SAMPLE DOCUMENT TEXT\nName: John Doe\nID: ABC123456',
      processed: true,
      confidence: 0.95,
      entities: {
        name: 'John Doe',
        idNumber: 'ABC123456'
      }
    };

    this.documents[docIndex].ocrData = ocrData;

    return {
      success: true,
      ocrData
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function for API calls (to use when connecting to real backend)
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
