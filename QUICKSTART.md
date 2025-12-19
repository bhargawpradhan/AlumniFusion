# Quick Start Guide - AlumniFusion

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Step 2: Setup MongoDB

Make sure MongoDB is installed and running:
- **Local MongoDB**: Start with `mongod` or use MongoDB Compass
- **Cloud MongoDB**: Use MongoDB Atlas (free tier available)

### Step 3: Configure Environment

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumnifusion
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

### Step 5: Open Browser

Navigate to: http://localhost:3000

## ✅ That's it!

You should now see the AlumniFusion homepage with:
- Beautiful gradient background
- Animated cursor with tail
- Floating particles
- All features working

## 🎯 Test Accounts

You can register a new account or use the API to create test users.

## 📚 Next Steps

1. Register a new user account
2. Explore the dashboard
3. Check out the admin panel (login as admin)
4. Customize colors in `tailwind.config.js`
5. Add your own Lottie animations

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env`

**Port Already in Use:**
- Change PORT in `backend/.env`
- Update proxy in `frontend/vite.config.js`

**Module Not Found:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📞 Need Help?

Check the main README.md for detailed documentation.

