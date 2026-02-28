# 🚀 Initialize Admin User - Quick Guide

## The Problem
You're getting a 401 error on admin login because the admin user doesn't exist in the database yet.

## ✅ Solution: Initialize Admin User

### Option 1: Run Locally (Easiest)

1. **Open PowerShell or Command Prompt**

2. **Navigate to backend folder**:
```bash
cd C:\Users\LENOVO\Downloads\skyriting_up\project\backend
```

3. **Create temporary .env file**:
```bash
echo MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0 > .env
echo ADMIN_EMAIL=admin@skyriting.com >> .env
echo ADMIN_PASSWORD=Admin@123 >> .env
```

4. **Run init script**:
```bash
npm run init-admin
```

5. **You should see**:
```
✅ Admin user created successfully!
📧 Email: admin@skyriting.com
🔑 Password: Admin@123
```

6. **Delete .env file** (optional, for security):
```bash
del .env
```

7. **Test login**:
   - Go to: `https://skyriting.com/3636847rgyuvfu3f/98184t763gvf/login`
   - Email: `admin@skyriting.com`
   - Password: `Admin@123`

### Option 2: Check if Admin Already Exists

If the script says "Admin user already exists", try logging in with:
- Email: `admin@skyriting.com`
- Password: `Admin@123`

If it still doesn't work, the password might be different. You'll need to reset it via MongoDB Atlas.

---

## 🔧 What I Fixed

### 1. Font Errors ✅
- Removed missing Helvetica font files
- Now uses system fonts: `Helvetica Neue`, `Helvetica`, `Arial`
- No more font loading errors in console

### 2. Manifest Icon Error ✅
- Fixed missing icon-144x144.png error
- Now uses existing logo.svg and favicon.svg

### 3. CORS Improvements ✅
- Better CORS handling for custom domain
- Supports both `skyriting.com` and `www.skyriting.com`

---

## 📋 After Initializing Admin

1. **Login to Admin Panel**:
   - URL: `https://skyriting.com/3636847rgyuvfu3f/98184t763gvf/login`
   - Email: `admin@skyriting.com`
   - Password: `Admin@123`

2. **Change Password Immediately**:
   - After login, go to admin settings
   - Change the default password to something secure

3. **Start Managing Content**:
   - Add aircraft
   - Add routes
   - Add services
   - Add packages
   - Add articles
   - Manage inquiries

---

## 🐛 If Init Script Fails

### MongoDB Connection Error:
- Check your internet connection
- Verify MongoDB Atlas is accessible
- Check MongoDB Atlas IP whitelist (should allow your IP or 0.0.0.0/0)

### "Admin already exists" Error:
- Try logging in with the credentials
- If login fails, you may need to reset the password via MongoDB Atlas

---

**Run the init script now to create your admin user!** 🔐
