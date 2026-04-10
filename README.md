# CareConnect - Online Health Consultation Platform

A comprehensive MERN stack telemedicine application enabling seamless healthcare consultations, appointment management, and digital prescriptions.

## 🎯 Features

### For Patients
- 👤 User registration and authentication
- 🔍 Search doctors by specialization, fees, and location
- 📅 Book appointments with real-time availability
- 📱 Video consultation with doctors
- 🏥 Find nearby hospitals and pharmacies
- 🚨 Quick access to emergency services
- 💳 Secure payment through Razorpay
- 📋 Digital prescription management
- 💊 Medicine reminder system
- 📊 Health tracking dashboard

### For Doctors
- 👨‍⚕️ Professional profile management
- 📍 Specialization and qualification details
- ⏰ Availability scheduling
- 👥 Appointment management
- 📹 Video consultation capability
- 📝 Digital prescription creation
- 💰 Earnings tracking
- ⭐ Patient ratings and reviews

### For Admins
- 📊 Hospital management
- 🏪 Pharmacy management
- 🚑 Emergency service coordination
- 👥 User management
- 📈 Analytics and reporting

## 🛠️ Technology Stack

### Frontend
- **React.js** 19.2.4 - UI framework
- **React Router** 7.13.1 - Client-side routing
- **Redux** 5.0.1 - State management
- **Axios** 1.13.6 - HTTP client
- **Bootstrap** 5.3.8 - UI components
- **Tailwind CSS** - Utility CSS
- **Socket.io-client** 4.8.3 - Real-time communication
- **SimpleP2P** 9.11.1 - Peer-to-peer connections

### Backend
- **Node.js** - Runtime
- **Express.js** 4.18.2 - Web framework
- **MongoDB** 7.0.3 - Database
- **Mongoose** 7.0.3 - ODM
- **JWT** 9.0.0 - Authentication
- **Bcryptjs** 2.4.3 - Password hashing
- **Razorpay** 2.9.6 - Payment gateway
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

## 📦 Installation

### Prerequisites
- Node.js v14+
- MongoDB v4.4+
- npm or yarn

### Step 1: Clone Repository
```bash
cd careconnect
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://careconnect:careconnect123@careconnectcluster.qvuuvtj.mongodb.net/careconnect
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NODE_ENV=development
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm start
```
Application will open on `http://localhost:3000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Doctors
- `GET /api/doctors/search` - Search doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/profile` - Update doctor profile
- `PUT /api/doctors/availability` - Set availability

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/my/appointments` - User appointments
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Hospitals
- `GET /api/hospitals/search` - Search hospitals
- `GET /api/hospitals/:id` - Hospital details

### Pharmacies
- `GET /api/pharmacies/search` - Search pharmacies
- `GET /api/pharmacies/:id` - Pharmacy details

### Emergency Services
- `GET /api/emergency/search` - Search emergency services

### Payments
- `POST /api/payments/checkout` - Create payment order
- `POST /api/payments/verify` - Verify payment

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/:appointmentId` - Get prescription

## 📁 Project Structure

```
careconnect/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express app
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── redux/       # State management
│   │   └── App.js       # Root component
│   └── .env             # Environment variables
│
├── SETUP_GUIDE.md       # Detailed setup instructions
└── README.md            # This file
```

## 🧪 Testing the Application

### Patient Registration & Login
1. Go to http://localhost:3000/register
2. Select "Patient" role
3. Fill in registration details
4. Click Register

### Search Doctors
1. Navigate to Patient Dashboard
2. Click "Search Doctors"
3. Apply filters (specialization, fees, location)
4. Click "Book Appointment" on any doctor

### Doctor Registration
1. Go to http://localhost:3000/register
2. Select "Doctor" role
3. Fill in registration details
4. Complete doctor profile setup

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Authorization headers on API calls

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env or
# Kill existing process on port 5000
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Verify connection string in .env
- Check internet connection for MongoDB Atlas

### Frontend Can't Reach API
- Confirm backend is running
- Check API URL in frontend .env
- Verify CORS is enabled

## 📝 Database Models

### User
- Email, password, phone, role, address, city, state
- Profile image, date of birth, gender
- Verification and active status

### Doctor
- Specialization, experience, qualifications
- License number, hospital, consultation fees
- Languages, availability slots, ratings
- Bank details and earnings

### Appointment
- Patient and doctor references
- Date, time, duration, status
- Payment status, consultation fee
- Reason for visit, notes, video room ID

### Hospital
- Contact info, address, coordinates
- Departments, bed management
- Emergency and ambulance services
- Operating hours, ratings

### Pharmacy
- Contact info, address, coordinates
- Available medicines with pricing
- Operating hours, stock management
- Ratings and reviews

### Prescription
- Appointment, doctor, and patient references
- Medicines with dosage and frequency
- Advice and test recommendations
- Follow-up date

### Emergency Service
- Service type (ambulance, fire, police)
- Contact info, location, coordinates
- Response time, availability status

## 🚀 Deployment

### Heroku (Backend)
```bash
heroku create careconnect-backend
git push heroku main
heroku config:set JWT_SECRET=xxx
```

### Vercel (Frontend)
```bash
vercel
# Set environment variables in Vercel dashboard
```

## 📞 Support

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Backend Development
- Frontend Development
- Database Design
- API Integration

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
