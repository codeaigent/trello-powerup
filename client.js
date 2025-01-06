/* global TrelloPowerUp */

console.log('CodeAIgent Power-Up initializing...'); // Debug log
// API key is defined in config.js which is generated during deployment
if (!POWERUP_API_KEY) {
    console.error('API key not found. Make sure config.js is properly generated.');
}

// Function to add bot to board
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
    })
    .then(function() {
      return t.alert({
        message: 'CodeAIgent bot has been added to the board!',
        duration: 5
      });
    })
    .catch(function(error) {
      console.error('Failed to add bot:', error);
      return t.alert({
        message: 'Failed to add bot. Please try again.',
        duration: 5,
        display: 'error'
      });
    });
}

// This is the main initialization function that Trello will call
window.TrelloPowerUp.initialize({
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'authToken')
    .then(function(authToken) {
      return { authorized: authToken != null }
    });
  },

  'show-authorization': function(t, options) {
    return t.popup({
      title: 'CodeAIgent Authorization',
      url: './auth.html',
      height: 140,
    });
  },

  'card-buttons': function(t, options) {
    return t.get('member', 'private', 'authToken')
      .then(function(authToken) {
        if (!authToken) {
          return [{
            icon: {
              dark: './icon-dark.png',
              light: './icon-light.png'
            },
            text: '🤖 Authorize CodeAIgent',
            callback: function(t) {
              return t.popup({
                title: 'CodeAIgent Authorization',
                url: './auth.html',
                height: 140
              });
            }
          }];
        }
        
        return [{
          icon: {
            dark: './icon-dark.png',
            light: './icon-light.png'
          },
          text: '🤖 CodeAIgent',
          callback: function(t) {
            console.log('CodeAIgent button clicked'); // Debug log
            return t.popup({
              title: 'CodeAIgent Actions',
              items: [
                {
                  text: '📝 Add @codeaigent Comment',
                  callback: function(t) {
                    return t.card('id', 'name')
                      .then(function(card) {
                        console.log('Adding comment to card:', card.id);
                        // First ensure bot is added to board
                        return addBotToBoard(t, authToken)
                          .then(function() {
                            // Add comment using Trello API
                            return fetch(`https://api.trello.com/1/cards/${card.id}/actions/comments?key=${POWERUP_API_KEY}&token=${authToken}`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                text: '@codeaigent Please help with this task'
                              })
                            });
                          })
                          .then(function() {
                            return t.set('card', 'shared', 'lastComment', {
                              text: '@codeaigent Please help with this task',
                              timestamp: new Date().toISOString()
                            });
                          });
                      });
                  }
                },
                {
                  text: '👀 View Last Response',
                  callback: function(t) {
                    return t.get('card', 'shared', 'lastComment')
                      .then(function(lastComment) {
                        if (lastComment) {
                          return t.popup({
                            title: 'Last CodeAIgent Comment',
                            items: [{
                              text: lastComment.text + '\n' + new Date(lastComment.timestamp).toLocaleString()
                            }]
                          });
                        } else {
                          return t.alert({
                            message: 'No CodeAIgent comments yet!',
                            duration: 3
                          });
                        }
                      });
                  }
                }
              ]
            });
          }
        }];
      });
  }
}); 