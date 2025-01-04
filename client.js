/* global TrelloPowerUp */

console.log('CodeAIgent Power-Up initializing...'); // Debug log

// Load API key from environment or secure configuration
const POWERUP_API_KEY = process.env.TRELLO_API_KEY || ''; // Will be injected during build
// if the powerup api key is not found, throw an error
if (!POWERUP_API_KEY) {
  throw new Error('TRELLO_API_KEY is not set');
}
const BOT_USERNAME = 'codeaigent'; // Your bot's username

// This is the main initialization function that Trello will call
window.TrelloPowerUp.initialize({
  'authorization': function(t, options) {
    // Return a promise that resolves to the authorization status
    return t.get('member', 'private', 'token')
      .then(function(token) {
        if (token) {
          return { authorized: true };
        }
        return { authorized: false };
      });
  },

  // Called when the Power-Up is enabled on a board
  'on-enable': function(t, options) {
    return t.modal({
      url: './auth.html',
      height: 140,
      title: 'CodeAIgent Setup',
      fullscreen: false,
    });
  },

  'card-buttons': function(t, options) {
    console.log('card-buttons capability called', options); // Debug log
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
                    // Here we would normally make an API call to your backend
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
  }
}); 