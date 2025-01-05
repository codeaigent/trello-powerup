# Architecture Overview

This document outlines the architecture of the CodeAIgent Trello Power-Up.

## System Components

```
┌─────────────────┐     ┌──────────────┐     ┌────────────────┐
│  Trello Board   │     │  Power-Up UI │     │  GitHub Pages  │
│  (User + Bot)   │◄────┤  (Frontend)  │◄────┤  (Hosting)     │
└─────────────────┘     └──────────────┘     └────────────────┘
        ▲                      ▲                     ▲
        │                      │                     │
        │                      │                     │
        │                ┌──────────────┐     ┌────────────────┐
        └────────────────┤ Trello API   │     │  GitHub        │
                        │ (External)    │     │  Actions       │
                        └──────────────┘     └────────────────┘
```

## Component Details

### 1. Frontend (Power-Up UI)

#### Key Files
- `client.js`: Main Power-Up logic
- `auth.html`: Authorization interface
- `auth-success.html`: OAuth callback handler
- `index.html`: Entry point

#### Responsibilities
- User interface
- Authorization flow
- API interactions
- Bot integration

### 2. Configuration

#### Files
- `config.js`: Generated configuration
- `manifest.json`: Power-Up manifest
- `.env`: Development environment

#### Environment Variables
```javascript
POWERUP_API_KEY=your_api_key
BOT_EMAIL=bot@codeaigent.com
```

### 3. Deployment

#### GitHub Pages
- Hosts static files
- Serves Power-Up content
- Handles OAuth callbacks

#### GitHub Actions
- Builds configuration
- Injects secrets
- Deploys to Pages

## Data Flow

### 1. Authorization Flow
```
User → Authorize Button → Trello OAuth → Callback → Token Storage
```

### 2. Bot Integration
```
User → Add Comment → Check Bot → Add Bot → Post Comment
```

### 3. Token Management
```
OAuth Token → Power-Up Storage → API Calls
```

## Security Architecture

### 1. Secrets Management
- API keys in GitHub Secrets
- Tokens in Power-Up storage
- No client-side exposure

### 2. Authorization
- OAuth 2.0 flow
- Scoped permissions
- Secure token storage

### 3. API Security
- HTTPS only
- Token validation
- Error handling

## Code Organization

### 1. Core Components
```javascript
// Power-Up Initialization
window.TrelloPowerUp.initialize({
  'authorization-status': function(t, options) {...},
  'show-authorization': function(t, options) {...},
  'card-buttons': function(t, options) {...}
});
```

### 2. Authorization Module
```javascript
// OAuth Configuration
var authUrl = 'https://trello.com/1/authorize?' +
  'expiration=never' +
  '&name=' + appName +
  '&scope=read,write' +
  '&key=' + POWERUP_API_KEY +
  '&callback_method=fragment' +
  '&return_url=' + returnUrl;
```

### 3. Bot Integration
```javascript
// Bot Management
function addBotToBoard(t, token) {
  return t.board('id')
    .then(function(board) {
      // API call to add bot
    });
}
```

## Future Architecture

### 1. Backend Service
```
Power-Up → API Gateway → Lambda Functions → Bot Logic
```

### 2. Webhook System
```
Trello → Webhooks → Backend → AI Processing → Response
```

### 3. AI Integration
```
Comment → NLP Processing → Code Analysis → Response Generation
```

## Performance Considerations

### 1. Static Content
- Minification
- Caching
- CDN delivery

### 2. API Calls
- Rate limiting
- Request batching
- Error retries

### 3. User Experience
- Loading states
- Error feedback
- Smooth transitions

## Monitoring and Logging

### 1. Error Tracking
```javascript
console.error('Operation failed:', {
  error: err,
  context: 'addBotToBoard',
  boardId: board.id
});
```

### 2. User Actions
```javascript
console.log('User action:', {
  action: 'addComment',
  cardId: card.id,
  timestamp: new Date()
});
```

### 3. API Calls
```javascript
console.log('API call:', {
  endpoint: '/boards/members',
  method: 'PUT',
  status: response.status
});
```

## Dependencies

### External Services
- Trello API
- GitHub Pages
- GitHub Actions

### Libraries
- Trello Power-Up Client
- Fetch API
- DOM APIs

## Configuration Management

### Development
```javascript
// Local config
const config = {
  apiKey: process.env.TRELLO_API_KEY,
  botEmail: process.env.BOT_EMAIL
};
```

### Production
```javascript
// Generated config
const POWERUP_API_KEY = 'injected-at-build';
const BOT_EMAIL = 'injected-at-build';
``` 