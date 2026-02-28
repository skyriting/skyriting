# Railway Environment Variables Fix

## ⚠️ Important: Remove Quotes from Environment Variables

Railway environment variables should **NOT have quotes** around the values. The quotes are being included in the actual values, which causes issues.

## Current (WRONG):
```
PORT="5000"
MONGODB_URI="mongodb+srv://..."
FRONTEND_URL="https://skyriting.com"
```

## Correct (RIGHT):
```
PORT=5000
MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0
FRONTEND_URL=https://skyriting.com
```

## Steps to Fix in Railway:

1. Go to Railway Dashboard → Your Service → Variables
2. For each variable, click "Edit"
3. **Remove the quotes** from the value
4. Click "Save"
5. Railway will automatically redeploy

## Correct Environment Variables (No Quotes):

```
PORT=5000
MONGODB_URI=mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0
JWT_SECRET=yourfefurwforehvoire233rr3noduction
ADMIN_EMAIL=admin@skyriting.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=https://skyriting.com
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
GMAIL_USER=info@skyriting.com
NODE_ENV=production
```

## After Fixing:

1. Check Railway logs to see if errors are resolved
2. Test the website at https://skyriting.com
3. Check that MongoDB connects successfully
4. Verify CORS is working correctly
