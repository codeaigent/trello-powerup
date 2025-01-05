# Development Guide

This guide covers the development process for the CodeAIgent Trello Power-Up.

## Local Development

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   TRELLO_API_KEY=your_api_key_here
   BOT_EMAIL=bot@codeaigent.com
   ```

3. Start development server:
   ```bash
   npm start
   ```

### Development Workflow

1. **Code Organization**
   ```
   client.js        # Main Power-Up logic
   auth.html        # Authorization flow
   auth-success.html # OAuth callback
   config.js        # Generated configuration
   ```

2. **Making Changes**
   - Edit files locally
   - Test in browser
   - Commit changes
   - Push to trigger deployment

## Testing

### Local Testing

1. Add to Trello:
   - Go to board → Power-Ups → Custom
   - Add `http://localhost:8080` as Power-Up URL

2. Test Authorization:
   - Click "Authorize" button
   - Verify token storage
   - Check console for errors

3. Test Bot Integration:
   - Add bot to board
   - Create test comments
   - Verify API calls

### Production Testing

1. Deploy to GitHub Pages:
   ```bash
   git push origin main
   ```

2. Verify deployment:
   - Check GitHub Actions
   - Visit Power-Up URL
   - Test in Trello

## Debugging

### Console Logging
```javascript
console.log('CodeAIgent Power-Up initializing...'); // Debug log
console.log('Adding comment to card:', card.id);
console.error('Failed to authorize', err);
```

### Network Requests
Monitor in browser DevTools:
- Authorization requests
- API calls
- Webhook responses

### Common Issues

1. **CORS Errors**
   ```javascript
   // Add proper headers
   headers: {
     'Content-Type': 'application/json',
     'Accept': 'application/json'
   }
   ```

2. **Authorization Issues**
   ```javascript
   // Check token validity
   if (!authToken) {
     console.error('No auth token found');
     return;
   }
   ```

## Deployment

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create config
        run: |
          echo "const POWERUP_API_KEY = '${{ secrets.TRELLO_API_KEY }}'" > config.js
          echo "const BOT_EMAIL = '${{ secrets.BOT_EMAIL }}'" >> config.js
```

### Manual Deployment

If needed, you can deploy manually:
1. Build configuration
2. Copy files to `gh-pages` branch
3. Push to GitHub

## Best Practices

### 1. Code Style
- Use consistent formatting
- Add meaningful comments
- Follow JavaScript best practices

### 2. Error Handling
```javascript
.catch(function(error) {
  console.error('Operation failed:', error);
  return t.alert({
    message: 'Something went wrong. Please try again.',
    duration: 5,
    display: 'error'
  });
});
```

### 3. User Experience
- Clear feedback messages
- Proper loading states
- Graceful error handling

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

### Pull Request Process
1. Update documentation
2. Test all changes
3. Update README if needed
4. Request review

## Resources

### Trello Documentation
- [Power-Up Documentation](https://developer.atlassian.com/cloud/trello/power-ups/)
- [REST API Reference](https://developer.atlassian.com/cloud/trello/rest/)
- [Capabilities Reference](https://developer.atlassian.com/cloud/trello/power-ups/capabilities/)

### Tools
- [Trello Power-Up CLI](https://github.com/trello/power-up-template)
- [Developer Portal](https://trello.com/power-ups/admin)
- [API Explorer](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/) 