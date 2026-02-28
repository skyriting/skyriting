# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start) ⭐

This is the easiest and fastest way to get started. MongoDB Atlas offers a free tier.

### Steps:

1. **Sign up for MongoDB Atlas** (Free):
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `skyriting-admin` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) OR add your current IP
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `skyriting`

6. **Update Backend .env**:
   ```env
   MONGODB_URI=mongodb+srv://skyriting-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skyriting?retryWrites=true&w=majority
   ```

7. **Test Connection**:
   ```bash
   cd project/backend
   npm run init-admin
   ```

---

## Option 2: Install MongoDB Locally

### Windows Installation:

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or 6.0)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**:
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important**: Check "Install MongoDB as a Service"
   - Check "Run service as Network Service user"
   - Check "Install MongoDB Compass" (optional GUI tool)
   - Click "Install"

3. **Verify Installation**:
   - MongoDB should start automatically as a Windows service
   - Open Services (Win+R → `services.msc`)
   - Look for "MongoDB" service - it should be "Running"

4. **Test Connection**:
   ```bash
   # Test if MongoDB is running
   mongosh
   # If it connects, type 'exit' to quit
   ```

5. **Update Backend .env** (if needed):
   ```env
   MONGODB_URI=mongodb://localhost:27017/skyriting
   ```

6. **Run Admin Init**:
   ```bash
   cd project/backend
   npm run init-admin
   ```

### If MongoDB Service is Not Running:

1. **Start MongoDB Service**:
   ```powershell
   # Open PowerShell as Administrator
   Start-Service MongoDB
   ```

2. **Or use Services GUI**:
   - Press `Win+R` → type `services.msc`
   - Find "MongoDB" service
   - Right-click → "Start"

3. **Verify it's running**:
   ```powershell
   Get-Service MongoDB
   ```

---

## Option 3: Use Docker (If You Have Docker Installed)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Then use in .env:
MONGODB_URI=mongodb://localhost:27017/skyriting
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED"

**Causes:**
- MongoDB is not installed
- MongoDB service is not running
- Firewall blocking port 27017
- Wrong connection string

**Solutions:**

1. **Check if MongoDB is running**:
   ```powershell
   Get-Service MongoDB
   ```

2. **Start MongoDB service**:
   ```powershell
   Start-Service MongoDB
   ```

3. **Check if port 27017 is accessible**:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **For MongoDB Atlas**:
   - Verify your IP is whitelisted in Network Access
   - Check username and password in connection string
   - Ensure cluster is running (not paused)

### Error: "Authentication failed"

- Check username and password in connection string
- Verify database user has correct permissions
- For Atlas: Make sure you're using the database user password, not your Atlas account password

---

## Quick Test

After setup, test your connection:

```bash
cd project/backend
npm run init-admin
```

You should see:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
✅ Admin user created successfully!
```

---

## Recommendation

**For Development**: Use **MongoDB Atlas** (Option 1) - it's free, no installation needed, and works immediately.

**For Production**: Use **MongoDB Atlas** paid tier or your own MongoDB server.
