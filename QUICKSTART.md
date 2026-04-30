# Quick Start Guide - KYC Manager

Get your KYC Document Management System up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Open Your Browser

Navigate to: `http://localhost:3000`

### 4. Login with Demo Account

**Admin Account:**
- Email: `admin@kyc.com`
- Password: `admin123`

**Organization Account:**
- Email: `org@demo.com`
- Password: `demo123`

That's it! 🎉 You're now running the complete KYC management system.

---

## 📱 What You Get

### Immediate Access To:
- ✅ Complete dashboard with analytics
- ✅ Document upload and management
- ✅ OCR data extraction viewer
- ✅ Fraud detection scores
- ✅ Audit logging
- ✅ API key management
- ✅ Dark mode support
- ✅ Role-based access control

### Pre-configured Features:
- Mock data for development
- Responsive design (mobile-ready)
- Advanced filtering and search
- Data visualization with charts
- Toast notifications
- Form validation

---

## 🎯 First Steps

### As an Organization User:

1. **Upload a Document**
   - Click "Upload Document" button
   - Fill in user details
   - Select document type
   - Choose file (PDF, JPG, PNG)
   - Submit

2. **View Documents**
   - See all uploaded documents
   - Filter by status/type
   - Search by name/email
   - View OCR extracted data

3. **Check Analytics**
   - Navigate to Analytics page
   - View trends and charts
   - Monitor approval rates
   - Track fraud detection

### As an Admin:

1. **Review Documents**
   - Go to Documents page
   - Click "Review" on pending documents
   - Approve or Reject
   - Add rejection reason if needed

2. **Manage Organizations**
   - Navigate to Admin Panel
   - View all organizations
   - Edit plans and limits
   - Monitor system stats

3. **View Audit Logs**
   - Access Audit Logs page
   - Filter by action type
   - Export to CSV
   - Track all activities

---

## 🔧 Configuration

### Connecting to Your Backend

1. **Update API URL** in `/src/app/api/apiService.js`:
```javascript
const API_BASE_URL = 'https://your-backend.com/api';
```

2. **Replace Mock Data** with real API calls:
```javascript
// Before (Mock)
async getDocuments(filters) {
  await delay(300);
  return { success: true, documents: mockDocuments };
}

// After (Real API)
async getDocuments(filters) {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    headers: getAuthHeaders()
  });
  return response.json();
}
```

### Customizing Theme

Edit `/src/styles/theme.css`:
```css
:root {
  --primary: #3b82f6;  /* Change primary color */
  --secondary: #ececf0; /* Change secondary color */
}
```

### Adding Your Logo

Replace logo in `/src/app/layout/Sidebar.jsx`:
```jsx
<img src="/your-logo.png" alt="Logo" className="h-8 w-8" />
```

---

## 📚 Project Structure

```
/src/app
├── context/          # Auth & Theme contexts
├── api/              # API services & mock data
├── pages/            # Page components
├── layout/           # Layout components
├── components/ui/    # Reusable UI components
├── routes.jsx        # Route configuration
└── App.tsx          # Main app
```

---

## 🎨 Key Features Explained

### 1. Authentication System
- JWT-based authentication
- Role-based access (admin, organization, user)
- Protected routes
- Persistent login with localStorage

### 2. Document Management
- Upload documents (PDF, JPG, PNG)
- OCR data extraction
- Fraud score calculation
- Approve/Reject workflow
- Status tracking

### 3. Analytics Dashboard
- Real-time metrics
- Monthly trends (line charts)
- Status distribution (pie charts)
- Document type breakdown
- Processing performance

### 4. Dark Mode
- Toggle in header
- Persisted preference
- Smooth transitions
- Fully themed components

### 5. Responsive Design
- Mobile-first approach
- Collapsible sidebar
- Responsive tables
- Adaptive charts

---

## 🔐 Security Features

### Already Implemented:
- ✅ JWT token management
- ✅ Protected routes
- ✅ Role-based UI rendering
- ✅ Input validation
- ✅ Secure password handling (ready)

### When Connecting Backend:
- 🔒 Enable HTTPS
- 🔒 Implement CORS
- 🔒 Add rate limiting
- 🔒 Hash sensitive data
- 🔒 Implement CSP headers

---

## 📊 Using the Dashboard

### Key Metrics:
1. **Total Documents**: All uploaded documents
2. **Pending Reviews**: Documents awaiting approval
3. **Approved**: Successfully verified documents
4. **Rejected**: Documents that failed verification

### Charts:
- **Monthly Trends**: Upload patterns over time
- **Status Distribution**: Current document statuses
- **Processing Performance**: Average times and rates

---

## 🔑 API Key Management

### Generating API Keys:
1. Go to Settings → API Keys tab
2. View your current API key
3. Click regenerate to create new key
4. Copy and store securely

### Using API Keys:
```javascript
fetch('https://api.example.com/documents', {
  headers: {
    'X-API-Key': 'sk_test_your_key_here'
  }
});
```

---

## 📝 Common Tasks

### Add a New Page:

1. Create page component:
```jsx
// /src/app/pages/NewPage.jsx
export const NewPage = () => {
  return <div>New Page</div>;
};
```

2. Add route in `/src/app/routes.jsx`:
```jsx
{ path: "new-page", element: <NewPage /> }
```

3. Add navigation in `/src/app/layout/Sidebar.jsx`:
```jsx
{ path: '/new-page', icon: Icon, label: 'New Page' }
```

### Add a New Chart:

```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={myData}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
</LineChart>
```

### Add Custom Validation:

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!email.includes('@')) {
    toast.error('Invalid email');
    return;
  }
  
  // Proceed with submission
};
```

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Change port in vite.config.ts or:
npm run dev -- --port 3001
```

### Dependencies Not Installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Dark Mode Not Working?
- Check if `dark` class is on `<html>` element
- Verify theme context is wrapping app
- Clear localStorage and try again

### Charts Not Displaying?
- Ensure data is in correct format
- Check console for errors
- Verify recharts is installed

---

## 🚢 Deploying to Production

### Quick Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables:
```env
VITE_API_URL=https://your-production-api.com
VITE_ENV=production
```

---

## 📖 Next Steps

1. **Explore the Code**
   - Check out `/src/app/pages/Dashboard.jsx`
   - Look at `/src/app/api/apiService.js`
   - Review `/src/app/context/AuthContext.jsx`

2. **Customize the UI**
   - Update theme colors
   - Add your logo
   - Modify components

3. **Connect Backend**
   - Set up Node.js + Express
   - Configure MongoDB
   - Implement API endpoints

4. **Add Features**
   - Email notifications
   - Export reports
   - Bulk operations
   - Advanced analytics

5. **Deploy**
   - Frontend to Vercel/Netlify
   - Backend to Render/Railway
   - Database on MongoDB Atlas

---

## 🤝 Getting Help

- **Documentation**: Check `/README.md`
- **API Docs**: See `/API_DOCUMENTATION.md`
- **Backend Guide**: Read `/BACKEND_SETUP.md`
- **Issues**: GitHub Issues

---

## 💡 Pro Tips

1. **Use the Demo Accounts** to explore different role permissions
2. **Check the Network Tab** to see API call structure
3. **Open DevTools** to inspect component state
4. **Test Responsive** design on different screen sizes
5. **Try Dark Mode** for different user preferences

---

## ✨ What's Included

### Pages:
- ✅ Login & Registration
- ✅ Dashboard with analytics
- ✅ Document management
- ✅ Analytics & reporting
- ✅ Audit logs
- ✅ Settings & preferences
- ✅ Admin panel

### Features:
- ✅ Authentication
- ✅ Authorization (RBAC)
- ✅ File upload
- ✅ Search & filter
- ✅ Pagination
- ✅ Data visualization
- ✅ Dark mode
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Form validation

### Ready for Integration:
- 🔌 OCR processing
- 🔌 Fraud detection
- 🔌 Email notifications
- 🔌 Payment processing
- 🔌 Webhook support

---

**You're all set! Start building amazing KYC workflows! 🚀**

For detailed documentation, see:
- Full README: `/README.md`
- API Reference: `/API_DOCUMENTATION.md`
- Backend Guide: `/BACKEND_SETUP.md`
