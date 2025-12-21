import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './utils/ThemeContext'
import CustomCursor from './components/CustomCursor'
import FloatingBackground from './components/FloatingBackground'

// Layouts
import MainLayout from './layouts/MainLayout'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './user/Dashboard'
import UserProfile from './user/Profile'
import AlumniDirectory from './pages/AlumniDirectory'
import NetworkingHub from './pages/NetworkingHub'
import JobPortal from './pages/JobPortal'
import DonationPortal from './pages/DonationPortal'
import SuccessStories from './pages/SuccessStories'
import EventsReunions from './pages/EventsReunions'
import FeedbackSurvey from './pages/FeedbackSurvey'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import UserPublicProfile from './pages/UserPublicProfile'
import Announcements from './pages/Announcements'
import ForgotPassword from './pages/ForgotPassword'

// Admin Pages
import AdminDashboard from './admin/AdminDashboard'
import AdminUserManagement from './admin/AdminUserManagement'
import AdminEventManager from './admin/AdminEventManager'
import AdminContentManager from './admin/AdminContentManager'
import AdminJobManager from './admin/AdminJobManager'
import AdminAnnouncementManager from './admin/AdminAnnouncementManager'
import AdminMessageManager from './admin/AdminMessageManager'

import ErrorBoundary from './components/ErrorBoundary'

function AppContent() {
  return (
    <Router>
      <CustomCursor />
      <FloatingBackground />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="directory" element={<AlumniDirectory />} />
          <Route path="networking" element={<NetworkingHub />} />
          <Route path="jobs" element={<JobPortal />} />
          <Route path="donate" element={<DonationPortal />} />
          <Route path="success-stories" element={<SuccessStories />} />
          <Route path="events" element={<EventsReunions />} />
          <Route path="feedback" element={<FeedbackSurvey />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="profile/:id" element={<UserPublicProfile />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="events" element={<AdminEventManager />} />
          <Route path="jobs" element={<AdminJobManager />} />
          <Route path="content" element={<AdminContentManager />} />
          <Route path="announcements" element={<AdminAnnouncementManager />} />
          <Route path="messages" element={<AdminMessageManager />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App

