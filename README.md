# AlumniFusion - University Alumni Association Platform

A modern, full-stack platform for connecting Lovely Professional University alumni worldwide.

## 🚀 Features

- **User Management**: Registration, login, profile management
- **Alumni Directory**: Search and connect with alumni
- **Networking Hub**: Discussion groups and messaging
- **Job Portal**: Post and apply for jobs
- **Donation Portal**: Support your alma mater
- **Events & Reunions**: RSVP and manage events
- **Success Stories**: Share and read inspiring stories
- **Admin Dashboard**: Comprehensive admin panel
- **Dark Mode**: Beautiful dark/light theme toggle
- **Custom Cursor**: Animated cursor with tail effect
- **Responsive Design**: Mobile-first, fully responsive

## 🛠 Tech Stack

### Frontend
- React.js (JSX)
- Tailwind CSS
- Framer Motion (animations)
- React Router DOM
- Axios
- Lottie React
- Lucide Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

## 📁 Project Structure

```
AlumniCollage/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Main pages
│   │   ├── admin/          # Admin pages
│   │   ├── user/           # User pages
│   │   ├── layouts/        # Layout components
│   │   ├── utils/          # Utilities and context
│   │   ├── assets/         # Static assets
│   │   ├── animations/     # Lottie animations
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlumniCollage
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Setup Environment Variables**

   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/alumnifusion
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   # For local MongoDB: mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start server
- `npm run dev` - Start server with watch mode

## 🎨 Features Overview

### Pages
- **Home**: Hero section with Lottie animation, stats, feature cards
- **Login/Register**: Multi-step registration with OTP
- **User Dashboard**: Quick actions, stats, recent activity
- **Profile**: View and edit profile with skills and achievements
- **Alumni Directory**: Search and filter alumni
- **Networking Hub**: Discussion groups and messaging
- **Job Portal**: Browse and post jobs
- **Donation Portal**: Donate to various categories
- **Events**: View and RSVP to events
- **Success Stories**: Read inspiring alumni stories
- **Feedback**: Submit feedback and surveys
- **Contact/About**: Contact information and about page
- **Admin Dashboard**: Analytics and management

### Components
- Custom cursor with tail animation
- Floating background particles
- Glassmorphism cards
- Dark mode toggle
- Animated buttons
- Toast notifications
- Loading skeletons

## 🔐 Authentication

The app uses JWT-based authentication. Register a new user or login to access protected routes.

## 📱 Responsive Design

The platform is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/rsvp` - RSVP to event

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `POST /api/jobs/:id/apply` - Apply to job

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/stats/summary` - Get donation stats

### Stories
- `GET /api/stories` - Get all approved stories
- `POST /api/stories` - Create story
- `POST /api/stories/:id/approve` - Approve story

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/stats` - Get feedback stats

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js` to customize the color scheme.

### Animations
Lottie animations are stored in `frontend/src/animations/`. Replace with your own JSON files.

## 📄 License

This project is created for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email alumni@gec.edu or open an issue in the repository.

---

**Built with ❤️ for Government Engineering College Alumni**

