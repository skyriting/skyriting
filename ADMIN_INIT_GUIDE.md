# Admin User Initialization Guide

## 🔐 Initialize Admin User

The 401 error on admin login means the admin user doesn't exist in the database yet.

## Method 1: Run Locally (Recommended)

1. **Create temporary `.env` file** in `project/backend/`:

```env
MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0
ADMIN_EMAIL=admin@skyriting.com
ADMIN_PASSWORD=Admin@123
```

2. **Run the init script**:

```bash
cd project/backend
npm run init-admin
```

3. **You should see**:
```
✅ Admin user created successfully!
📧 Email: admin@skyriting.com
🔑 Password: Admin@123
```

4. **Delete the `.env` file** after running (it's only for local init)

5. **Test login** at: `https://skyriting.com/3636847rgyuvfu3f/98184t763gvf/login`
   - Email: `admin@skyriting.com`
   - Password: `Admin@123`

## Method 2: Using Railway CLI

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Link to your project**:
```bash
cd C:\Users\LENOVO\Downloads\skyriting_up
railway link
```

4. **Run init script**:
```bash
cd project/backend
railway run npm run init-admin
```

## Method 3: Create Admin via MongoDB Atlas

1. Go to MongoDB Atlas → Collections
2. Select `skyritingdb` database
3. Find `adminusers` collection
4. Click "Insert Document"
5. Add:
```json
{
  "email": "admin@skyriting.com",
  "password": "$2a$10$...", // You need to hash this with bcrypt
  "name": "Skyriting Admin",
  "role": "admin"
}
```

**Note:** This method requires manually hashing the password with bcrypt, which is complex. Use Method 1 instead.

## Default Admin Credentials

After initialization:
- **Email:** `admin@skyriting.com`
- **Password:** `Admin@123`

⚠️ **IMPORTANT:** Change the password immediately after first login!

## Troubleshooting

### If init script fails:

1. **Check MongoDB connection**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure database name is `skyritingdb`

2. **Check environment variables**:
   - `ADMIN_EMAIL` should be set
   - `ADMIN_PASSWORD` should be set
   - `MONGODB_URI` should include `/skyritingdb`

3. **Check if admin already exists**:
   - The script will show "Admin user already exists" if it does
   - Try logging in with the credentials

### If login still fails after init:

1. **Verify admin was created**:
   - Check MongoDB Atlas → `skyritingdb` → `adminusers` collection
   - Should see a document with email `admin@skyriting.com`

2. **Check password**:
   - Ensure you're using: `Admin@123`
   - Case-sensitive

3. **Check Railway logs**:
   - Look for authentication errors
   - Check if JWT_SECRET is set correctly

## Quick Fix Command

Run this locally (one-time setup):

```bash
cd C:\Users\LENOVO\Downloads\skyriting_up\project\backend
echo MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0 > .env
echo ADMIN_EMAIL=admin@skyriting.com >> .env
echo ADMIN_PASSWORD=Admin@123 >> .env
npm run init-admin
del .env
```

---

**After initialization, you can log in to the admin panel!** 🔐
