# Bot Integration

This document explains how the CodeAIgent bot integrates with Trello boards and handles mentions.

## Bot Account

### Overview
The CodeAIgent bot is a regular Trello account that:
- Gets added to boards when users use the Power-Up
- Listens for @mentions in cards
- Responds with AI-generated assistance

### Setup
1. Create a Trello account for the bot
2. Configure the bot's email in Power-Up settings
3. Bot gets added to boards automatically when needed

## Board Integration

### Adding Bot to Board
When a user tries to use the bot, we first ensure it's added to the board:

```javascript
function addBotToBoard(t, token) {
  return t.board('id')
    .then(function(board) {
      return fetch(`https://api.trello.com/1/boards/${board.id}/members?key=${POWERUP_API_KEY}&token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: BOT_EMAIL,
          type: 'normal'
        })
      });
    });
}
```

### Flow
1. User clicks "Add @codeaigent Comment"
2. Power-Up checks if bot is on board
3. If not, adds bot using Trello API
4. Proceeds with adding comment

## Mention Handling

### Current Implementation
Currently, the Power-Up:
1. Adds bot to board when needed
2. Creates comments mentioning @codeaigent
3. Stores last comment in Power-Up storage

### Comment Creation
```javascript
fetch(`https://api.trello.com/1/cards/${card.id}/actions/comments?key=${POWERUP_API_KEY}&token=${authToken}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: '@codeaigent Please help with this task'
  })
});
```

## Future Enhancements

### 1. Webhook Setup
To make the bot fully interactive:
1. Set up Trello webhooks to listen for comments
2. Create backend API to receive webhook notifications
3. Process @mentions and generate responses

### 2. Backend Service
Need to create:
1. API endpoint for webhooks
2. Authentication system for bot
3. AI integration for responses

### 3. Response System
Bot should:
1. Detect when it's mentioned
2. Analyze the card and comment context
3. Generate appropriate response
4. Post response as a comment

## Security Considerations

### 1. Bot Account Security
- Use strong password
- Enable 2FA if possible
- Keep credentials secure

### 2. API Access
- Use appropriate scopes
- Validate all requests
- Monitor for unusual activity

### 3. Data Privacy
- Only access necessary data
- Follow Trello's terms of service
- Respect user privacy

## Troubleshooting

### Common Issues

1. **Bot Addition Fails**
   - Check user's token permissions
   - Verify bot email is correct
   - Ensure board permissions allow member addition

2. **Comments Not Working**
   - Verify bot is board member
   - Check API permissions
   - Validate token scopes

3. **Bot Not Responding**
   - Check webhook configuration
   - Verify backend service
   - Monitor error logs

## Best Practices

1. **Rate Limiting**
   - Respect Trello's API limits
   - Implement backoff strategies
   - Cache when appropriate

2. **Error Handling**
   - Graceful degradation
   - Clear error messages
   - Proper logging

3. **User Experience**
   - Clear feedback
   - Helpful error messages
   - Intuitive interactions 