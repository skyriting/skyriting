# GitHub Setup and Push Instructions

## Step 1: Initialize Git Repository

If you haven't already initialized git:

```bash
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Skyriting platform with full features"
```

## Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/skyriting/skyriting.git
```

If remote already exists, update it:

```bash
git remote set-url origin https://github.com/skyriting/skyriting.git
```

## Step 5: Set Main Branch

```bash
git branch -M main
```

## Step 6: Push to GitHub

### Option A: Using Personal Access Token

```bash
# Set your GitHub token (temporary, for this session)
$env:GITHUB_TOKEN="your-github-token-here"

# Push using token
git push -u origin main
```

When prompted for credentials:
- Username: `skyriting` (or your GitHub username)
- Password: `your-github-token-here`

### Option B: Using Git Credential Helper (Recommended)

```bash
# Configure git to use token
git config --global credential.helper store

# Push (will prompt for credentials once)
git push -u origin main
```

When prompted:
- Username: `skyriting`
- Password: `your-github-token-here`

### Option C: Using SSH (If SSH key is set up)

```bash
# Change remote to SSH
git remote set-url origin git@github.com:skyriting/skyriting.git

# Push
git push -u origin main
```

## Step 7: Verify Push

Check your GitHub repository to verify all files are pushed:
https://github.com/skyriting/skyriting

## Important Notes

1. **Never commit `.env` files** - They are in `.gitignore`
2. **The token is sensitive** - Don't share it publicly
3. **For production**, use GitHub Actions or Railway's built-in Git integration
4. **Token expiration** - Personal access tokens can expire, generate a new one if needed

## Future Updates

For subsequent pushes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Troubleshooting

### Authentication Failed
- Verify token is valid and not expired
- Check token has `repo` scope
- Try regenerating token if needed

### Permission Denied
- Verify repository exists and you have write access
- Check if token has correct permissions

### Large Files
- If files are too large, use Git LFS or exclude them
- Check `.gitignore` is working correctly
