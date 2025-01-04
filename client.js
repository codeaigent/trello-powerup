/* global TrelloPowerUp */

console.log('CodeAIgent Power-Up initializing...'); // Debug log

// API key is defined in config.js which is generated during deployment
if (!POWERUP_API_KEY) {
  console.error('API key not found. Make sure config.js is properly generated.');
}

// This is the main initialization function that Trello will call
window.TrelloPowerUp.initialize({
  'authorization-status': function(t, options) {
    // Return a promise that resolves to the authorization status
    return t.get('member', 'private', 'token')
      .then(function(token) {
        return { authorized: token != null };
      });
  },

  'show-authorization': function(t, options) {
    return t.popup({
      title: 'CodeAIgent Authorization',
      url: './auth.html',
      height: 140
    });
  },

  'card-buttons': function(t, options) {
    return t.get('member', 'private', 'token')
      .then(function(token) {
        if (!token) {
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
                        return t.alert({
                          message: 'Adding @codeaigent to card...',
                          duration: 3
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