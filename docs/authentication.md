# Authentication Flow

The CodeAIgent Power-Up uses Trello's OAuth authentication flow to authorize users and obtain access tokens for API operations.

## Overview

The authentication flow involves three main components:
1. The Power-Up's authorization popup (`auth.html`)
2. Trello's OAuth authorization page
3. The success callback page (`auth-success.html`)

## Flow Diagram

```
User clicks "Authorize" → Power-Up opens auth popup → Trello OAuth page → Success callback → Token stored
```

## Implementation Details

### 1. Initial Authorization Request

In `auth.html`, we construct the authorization URL:

```javascript
var appName = encodeURIComponent('CodeAIgent');
var returnUrl = encodeURIComponent(window.location.origin + '/trello-powerup/auth-success.html');

var authUrl = 'https://trello.com/1/authorize?' +
  'expiration=never' +
  '&name=' + appName +
  '&scope=read,write' +
  '&key=' + POWERUP_API_KEY +
  '&callback_method=fragment' +
  '&return_url=' + returnUrl;
```

Parameters explained:
- `expiration=never`: Token doesn't expire
- `scope=read,write`: Permissions requested
- `callback_method=fragment`: Token returned in URL fragment
- `return_url`: Where Trello redirects after authorization

### 2. Authorization Window

We open the authorization window with specific options:

```javascript
var authorizeOpts = {
  height: 680,
  width: 580,
  validToken: function(token) {
    return token && token.length > 0;
  }
};

t.authorize(authUrl, authorizeOpts)
```

### 3. Success Callback

In `auth-success.html`, we handle the token:

```javascript
// Extract token from URL fragment
var hashParams = window.location.hash.substring(1).split('&').reduce(function(params, param) {
  var parts = param.split('=');
  params[parts[0]] = decodeURIComponent(parts[1]);
  return params;
}, {});

var token = hashParams.token;

// Try window.opener.authorize first, fallback to localStorage
if (window.opener && typeof window.opener.authorize === 'function') {
  window.opener.authorize(token);
} else {
  localStorage.setItem('token', token);
}
```

### 4. Token Storage

The token is stored in Trello's Power-Up storage:

```javascript
t.set('member', 'private', 'authToken', token)
```

This makes the token:
- Private to each user
- Accessible only through the Power-Up
- Persistent across sessions

## Security Considerations

1. **API Key Protection**
   - API key is injected during deployment
   - Never committed to source control
   - Stored in GitHub secrets

2. **Token Security**
   - Tokens are stored privately per user
   - Never exposed in client-side code
   - Used only for authorized API calls

3. **Scope Limitations**
   - Only requesting necessary permissions
   - Read/write scope for minimal functionality
   - User can revoke access anytime

## Usage in API Calls

The stored token is used for authenticated API calls:

```javascript
fetch(`https://api.trello.com/1/boards/${board.id}/members?key=${POWERUP_API_KEY}&token=${authToken}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: BOT_EMAIL,
    type: 'normal'
  })
});
```

## Troubleshooting

Common issues and solutions:

1. **Token Not Found**
   - Check if authorization completed successfully
   - Verify token storage in Power-Up storage
   - Try re-authorizing

2. **Authorization Failed**
   - Verify API key is correct
   - Check allowed origins in Power-Up settings
   - Ensure return URL is properly configured

3. **API Calls Failing**
   - Verify token permissions
   - Check token hasn't expired
   - Ensure API key is valid 