# KYC Document Management SaaS Platform

A comprehensive, production-ready B2B KYC (Know Your Customer) Document Management System built with React.js frontend, designed for multi-tenant organizations with role-based access control.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Isolated data and settings per organization
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control (RBAC)**: Admin, Organization, and User roles
- **Document Management**: Upload, review, approve/reject KYC documents
- **OCR Processing**: Extract data from documents (Tesseract.js ready)
- **Fraud Detection**: Automated fraud scoring and duplicate detection
- **Audit Logging**: Complete activity tracking for compliance
- **Analytics Dashboard**: Real-time insights and trends
- **API Key Management**: Generate and manage API keys for integrations

### UI/UX Features
- **Dark Mode**: Full dark theme support with toggle
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: Instant feedback with toast notifications
- **Advanced Filtering**: Search, filter, and paginate documents
- **Data Visualization**: Charts and graphs with Recharts

### Subscription & Plans
- **Free Plan**: 100 uploads, 5 users, 1GB storage
- **Pro Plan**: 1,000 uploads, 50 users, 10GB storage
- **Enterprise Plan**: Unlimited uploads and users

## 📁 Project Structure

```
/src/app
├── context/
│   ├── AuthContext.jsx          # Authentication state management
│   └── ThemeContext.jsx          # Dark/light theme management
├── api/
│   ├── mockData.js               # Mock data for development
│   └── apiService.js             # API service layer (ready for backend)
├── pages/
│   ├── Login.jsx                 # Login page
│   ├── Register.jsx              # Registration page
│   ├── Dashboard.jsx             # Main dashboard with analytics
│   ├── Documents.jsx             # Document management
│   ├── Analytics.jsx             # Detailed analytics
│   ├── AuditLogs.jsx            # Audit trail
│   ├── Settings.jsx              # User/org settings
│   ├── AdminPanel.jsx            # Admin-only panel
│   └── NotFound.jsx              # 404 page
├── layout/
│   ├── Layout.jsx                # Main layout wrapper
│   ├── Sidebar.jsx               # Navigation sidebar
│   └── Header.jsx                # Top header with user menu
├── components/
│   └── ui/                       # Reusable UI components
├── routes.jsx                    # React Router configuration
└── App.tsx                       # Main app component
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **React Router 7.13.0** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **Sonner** - Toast notifications

### Ready for Backend Integration
- **Node.js + Express** (backend code structure provided)
- **MongoDB + Mongoose** (schema models ready)
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary/AWS S3** for storage
- **Nodemailer** for email notifications
- **Tesseract.js** for OCR
- **Stripe** for payments

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm installed
- MongoDB Atlas account (for production backend)
- Cloudinary or AWS S3 account (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kyc-manager
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
```
http://localhost:3000
```

### Demo Accounts

**Admin Account:**
- Email: `admin@kyc.com`
- Password: `admin123`

**Organization Account:**
- Email: `org@demo.com`
- Password: `demo123`

## 📡 API Integration

### Connecting to Your Backend

The frontend is configured to work with mock data by default. To connect to your Node.js backend:

1. **Update API Base URL** in `/src/app/api/apiService.js`:
```javascript
const API_BASE_URL = 'https://your-backend-api.com/api';
```

2. **Backend API Endpoints Required:**
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/documents
POST   /api/documents/upload
GET    /api/documents/:id
PATCH  /api/documents/:id/status
DELETE /api/documents/:id
GET    /api/analytics
GET    /api/organizations
PATCH  /api/organizations/:id
GET    /api/audit-logs
```

### API Authentication

All requests include the JWT token in headers:
```javascript
Authorization: Bearer <token>
```

### Example API Call
```javascript
const response = await fetch('https://api.example.com/api/documents', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  }
});
```

## 🔐 Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Role-Based Access**: Protected routes and UI elements
- **API Key Authentication**: For external integrations
- **Audit Logging**: Track all critical operations
- **Input Validation**: Client-side validation for all forms
- **CORS Protection**: Ready for backend CORS configuration

## 📊 Features Breakdown

### Dashboard
- Total documents, pending reviews, approved/rejected counts
- Monthly upload trends (line chart)
- Status distribution (pie chart)
- Processing performance metrics

### Document Management
- Upload documents with metadata
- Real-time search and filtering
- Status management (pending/approved/rejected)
- Fraud score visualization
- OCR data extraction viewer
- Bulk operations support

### Analytics
- Detailed metrics and KPIs
- Monthly statistics table
- Document type distribution
- Processing performance tracking
- Approval/rejection rates

### Audit Logs
- Complete activity history
- Filterable by action type
- Export to CSV
- IP address tracking
- Timestamp information

### Settings
- Profile management
- Organization details
- API key generation and rotation
- Notification preferences
- Subscription management
- Usage statistics

### Admin Panel
- Organization management
- User oversight
- Plan assignment
- Status control
- System statistics

## 🎨 Customization

### Branding
Update colors in `/src/styles/theme.css`:
```css
:root {
  --primary: #030213;
  --secondary: #ececf0;
  /* ... other variables */
}
```

### Logo
Replace the logo in `/src/app/layout/Sidebar.jsx`

## 🔄 State Management

- **Authentication**: Context API (`AuthContext`)
- **Theme**: Context API (`ThemeContext`)
- **API Calls**: Centralized service (`apiService.js`)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Collapsible sidebar on mobile
- Responsive tables and charts

## 🧪 Testing

### Manual Testing
- Login/Registration flows
- Document upload and review
- Analytics data visualization
- Dark mode toggle
- Role-based access

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Import GitHub repository
- Auto-detected as Vite project
- Deploy

### Backend Deployment (Render/Railway/Heroku)

1. **Set Environment Variables**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_URL=cloudinary://...
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASS=your-password
STRIPE_SECRET_KEY=sk_...
```

2. **Deploy**
- Connect repository
- Auto-deploy on push

## 🔧 Environment Variables

Create `.env` file in root:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 📄 License

MIT License - feel free to use for commercial projects

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure

- **Components**: Reusable UI components in `/components`
- **Pages**: Route-level components in `/pages`
- **Contexts**: Global state in `/context`
- **API**: API calls and mock data in `/api`

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Complete frontend implementation
- ✅ Mock data and API structure
- ✅ Authentication and authorization
- ✅ Document management
- ✅ Analytics dashboard

### Phase 2 (Backend Integration)
- Backend API development
- MongoDB integration
- File upload to cloud storage
- OCR processing implementation
- Email notifications

### Phase 3 (Advanced Features)
- Real-time notifications (WebSocket)
- Advanced fraud detection
- ML-based document verification
- Webhook support
- Mobile app (React Native)

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@kycmanager.com
- Documentation: https://docs.kycmanager.com

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- Recharts for data visualization
- Lucide for icons
- Tailwind CSS team

---

**Built with ❤️ for modern KYC document management**
# KYC-Platform
