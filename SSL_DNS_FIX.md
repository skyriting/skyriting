# Fix SSL "Not Secured" Issue - DNS Configuration

## 🔴 Problem: Website shows "Not Secured"

This happens because:
1. SSL certificate hasn't been provisioned yet
2. DNS records are not correctly configured
3. Railway can't verify domain ownership

## ✅ Solution: Fix DNS Records in GoDaddy

### Current Issue:
Your `www` CNAME is pointing to `skyriting.com` - this is **WRONG**!

### Correct Configuration:

#### 1. Fix www CNAME Record

In GoDaddy DNS Management:

**Current (WRONG):**
- Type: CNAME
- Name: `www`
- Data: `skyriting.com.` ❌

**Correct (RIGHT):**
- Type: CNAME
- Name: `www`
- Data: `midz0c4k.up.railway.app` ✅ (NO trailing dot)

**Steps:**
1. Find the CNAME record with Name `www`
2. Click "Edit"
3. Change Data from `skyriting.com.` to `midz0c4k.up.railway.app`
4. Remove the trailing dot (.)
5. Click "Save"

#### 2. Verify Root Domain A Record

**Should be:**
- Type: A
- Name: `@`
- Data: `151.101.2.15`
- TTL: 1 Hour

#### 3. Verify Railway Verification TXT Record

**Should be:**
- Type: TXT
- Name: `_railway-verify`
- Data: `railway-verify=b0912babc4c8d23ce651e3253bbf74d389795790360a45bc0a69da2240a0d87b`
- TTL: 1 Hour

---

## 📋 Complete GoDaddy DNS Configuration

After fixes, your DNS should look like this:

| Type | Name | Data | TTL | Status |
|------|------|------|-----|--------|
| **A** | `@` | `151.101.2.15` | 1 Hour | ✅ Correct |
| **CNAME** | `www` | `midz0c4k.up.railway.app` | 1 Hour | ⚠️ **FIX THIS** |
| **TXT** | `_railway-verify` | `railway-verify=b0912babc4c8d23ce651e3253bbf74d389795790360a45bc0a69da2240a0d87b` | 1 Hour | ✅ Correct |
| NS | `@` | `ns47.domaincontrol.com.` | 1 Hour | ✅ Keep |
| NS | `@` | `ns48.domaincontrol.com.` | 1 Hour | ✅ Keep |
| MX | `@` | `aspmx.l.google.com.` (Priority: 1) | 1 Hour | ✅ Keep |
| *(All other MX, TXT records)* | | | | ✅ Keep |

---

## 🔧 Step-by-Step Fix in GoDaddy

### Step 1: Fix www CNAME

1. Go to GoDaddy → My Products → Domains → Manage DNS
2. Find the CNAME record with Name `www`
3. Click "Edit"
4. Change Data from `skyriting.com.` to `midz0c4k.up.railway.app`
5. **Important:** Remove the trailing dot (.)
6. Click "Save"

### Step 2: Verify Other Records

1. **A Record for @:**
   - Should be: `151.101.2.15`
   - If different, change it

2. **TXT Record for _railway-verify:**
   - Should exist with the Railway verification value
   - If missing, add it

---

## ⏳ Wait for DNS Propagation

After making changes:

1. **Wait 5-30 minutes** for DNS to propagate
2. **Check DNS propagation:**
   - Visit: https://www.whatsmydns.net/#CNAME/www.skyriting.com
   - Should show: `midz0c4k.up.railway.app`

3. **Verify in Railway:**
   - Railway Dashboard → Your Service → Settings → Domains
   - Check status for `skyriting.com`
   - Should change from "Waiting for DNS update" to "Active" or "Verified"

---

## 🔒 SSL Certificate Provisioning

Railway automatically provisions SSL certificates after DNS verification:

1. **DNS Verification:**
   - Railway checks the `_railway-verify` TXT record
   - Verifies A and CNAME records point correctly
   - Status changes to "Verified"

2. **SSL Provisioning:**
   - Railway automatically requests SSL certificate
   - Takes 5-10 minutes after DNS verification
   - Certificate is issued by Let's Encrypt

3. **Activation:**
   - SSL becomes active automatically
   - Website shows "Secure" with lock icon
   - HTTPS works on both `skyriting.com` and `www.skyriting.com`

---

## ✅ Verification Checklist

After fixing DNS:

- [ ] www CNAME points to `midz0c4k.up.railway.app` (no trailing dot)
- [ ] A record for @ points to `151.101.2.15`
- [ ] TXT record `_railway-verify` exists with correct value
- [ ] Wait 5-30 minutes for DNS propagation
- [ ] Check Railway Dashboard → Domains shows "Verified" or "Active"
- [ ] Wait 5-10 minutes for SSL provisioning
- [ ] Test `https://skyriting.com` (should show lock icon)
- [ ] Test `https://www.skyriting.com` (should also work)

---

## 🐛 Troubleshooting

### If Railway still shows "Waiting for DNS update"

1. **Check DNS propagation:**
   ```bash
   nslookup www.skyriting.com
   ```
   Should return: `midz0c4k.up.railway.app`

2. **Verify TXT record:**
   ```bash
   nslookup -type=TXT _railway-verify.skyriting.com
   ```
   Should return the Railway verification value

3. **Wait longer:**
   - DNS can take up to 48 hours (usually 5-30 minutes)
   - Railway checks periodically

### If SSL still not working after DNS verification

1. **Check Railway Dashboard:**
   - Go to Settings → Domains
   - Look for SSL status
   - Should show "Active" or "Provisioning"

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Try incognito/private mode

3. **Check certificate:**
   - Click the lock icon in browser
   - View certificate details
   - Should show "Let's Encrypt" or Railway certificate

### If www subdomain not working

1. **Verify CNAME:**
   - Should point to `midz0c4k.up.railway.app`
   - NOT `skyriting.com`

2. **Test both:**
   - `https://skyriting.com` (should work)
   - `https://www.skyriting.com` (should also work)

---

## 📞 Quick Fix Summary

**The main issue:** Your `www` CNAME is pointing to `skyriting.com` instead of Railway's domain.

**The fix:**
1. Edit www CNAME in GoDaddy
2. Change Data to: `midz0c4k.up.railway.app` (no trailing dot)
3. Save
4. Wait 5-30 minutes
5. Railway will verify and provision SSL automatically

---

**After fixing, your website will be secure with HTTPS! 🔒**
