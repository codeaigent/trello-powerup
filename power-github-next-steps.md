# Power-Up GitHub Integration Setup

## Overview
This document outlines the steps needed to implement GitHub integration in the Trello Power-Up frontend.

## 1. GitHub OAuth Setup

### 1.1 Configuration
```javascript
// capabilities.js
'use strict';

window.TrelloPowerUp.initialize({
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'githubToken')
    .then(function(token) {
      return { authorized: token != null };
    });
  },
  'show-authorization': function(t, options) {
    return t.popup({
      title: 'GitHub Authorization',
      url: './authorize-github.html',
      height: 140,
    });
  },
});
```

### 1.2 Authorization Flow
1. Create authorize-github.html:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://p.trellocdn.com/power-up.css">
    <script src="https://p.trellocdn.com/power-up.min.js"></script>
  </head>
  <body>
    <button id="auth-btn" class="mod-primary">Connect GitHub Account</button>
    <script src="./js/authorize-github.js"></script>
  </body>
</html>
```

2. Implement authorization logic:
```javascript
// js/authorize-github.js
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var authBtn = document.getElementById('auth-btn');
authBtn.addEventListener('click', function() {
  // GitHub OAuth flow
  const githubAuthUrl = 'https://github.com/login/oauth/authorize';
  const clientId = 'YOUR_GITHUB_CLIENT_ID';
  const scope = 'repo read:user';
  const redirectUri = 'YOUR_POWERUP_CALLBACK_URL';

  window.location.href = `${githubAuthUrl}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
});
```

3. Handle OAuth callback:
```javascript
// js/github-callback.js
var t = TrelloPowerUp.iframe();

// Get token from URL (after GitHub redirects back)
const code = new URLSearchParams(window.location.search).get('code');
if (code) {
  // Exchange code for token using your backend
  fetch('YOUR_BACKEND_URL/validate/github/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${code}`, // GitHub code
      'x-power-up-token': 'YOUR_POWERUP_TOKEN'
    },
    body: JSON.stringify({
      member: {
        id: await t.getMember('id'),
        fullName: await t.getMember('fullName'),
        email: await t.getMember('email'),
        avatarUrl: await t.getMember('avatar')
      },
      board: {
        id: await t.getContext().board
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    // Store the success status
    return t.set('member', 'private', 'githubConnected', true)
      .then(() => {
        // Close the popup and notify the main interface
        t.closePopup();
        t.alert({
          message: 'GitHub account connected successfully!',
          duration: 5,
        });
      });
  })
  .catch(error => {
    console.error('Error:', error);
    t.alert({
      message: 'Failed to connect GitHub account',
      duration: 5,
      display: 'error',
    });
  });
}
```

## 2. Repository Selection

### 2.1 Repository List Component
```javascript
// js/repository-settings.js
var t = TrelloPowerUp.iframe();

// Fetch repositories from your backend
async function loadRepositories() {
  const response = await fetch('YOUR_BACKEND_URL/github/repositories', {
    headers: {
      'Authorization': `Bearer ${await t.get('member', 'private', 'githubToken')}`,
      'x-power-up-token': 'YOUR_POWERUP_TOKEN'
    }
  });
  return response.json();
}

// Save selected repositories
async function saveSelectedRepos(selectedRepos) {
  await fetch('YOUR_BACKEND_URL/github/repositories/primary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await t.get('member', 'private', 'githubToken')}`,
      'x-power-up-token': 'YOUR_POWERUP_TOKEN'
    },
    body: JSON.stringify({ repositories: selectedRepos })
  });
}
```

### 2.2 Settings UI
```html
<!-- repository-settings.html -->
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://p.trellocdn.com/power-up.css">
    <script src="https://p.trellocdn.com/power-up.min.js"></script>
  </head>
  <body>
    <div id="repo-list"></div>
    <button id="save-btn" class="mod-primary">Save Settings</button>
    <script src="./js/repository-settings.js"></script>
  </body>
</html>
```

## 3. Implementation Steps

1. **Initial Setup**
   - Add GitHub OAuth capabilities to Power-Up manifest
   - Create authorization popup page
   - Implement OAuth flow

2. **Authorization Flow**
   - User clicks "Connect GitHub" in Power-Up settings
   - Redirect to GitHub OAuth page
   - Handle callback with code
   - Send code to backend with Trello user info
   - Store success status in Power-Up member data

3. **Repository Configuration**
   - Create repository settings page
   - Fetch user's repositories from GitHub
   - Allow selection of primary repositories
   - Save selections to backend

4. **UI/UX Considerations**
   - Show loading states during API calls
   - Handle errors gracefully with user feedback
   - Provide clear success/failure messages
   - Add repository search/filter functionality

5. **Security**
   - Validate all API calls with power-up token
   - Secure storage of GitHub connection status
   - Handle token refresh/expiration
   - Validate user permissions

## 4. Testing Checklist

1. **Authorization**
   - [ ] OAuth flow works end-to-end
   - [ ] Error handling for failed authorization
   - [ ] Token storage is secure
   - [ ] Authorization status persists across refreshes

2. **Repository Management**
   - [ ] Repository list loads correctly
   - [ ] Selection saves successfully
   - [ ] Changes reflect immediately in UI
   - [ ] Error states handled gracefully 