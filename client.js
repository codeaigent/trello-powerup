/* global TrelloPowerUp */

// we can access Trello's deferred object through `TrelloPowerUp.Promise`
const t = TrelloPowerUp.iframe();

// This is the main initialization function that Trello will call
window.TrelloPowerUp.initialize({
  // Start adding your Power-Up functionality here
  'board-buttons': function(t, options) {
    return [{
      icon: {
        dark: './icon-dark.png',
        light: './icon-light.png'
      },
      text: 'Sample Button',
      callback: function(t) {
        return t.modal({
          title: 'Sample Modal',
          url: './index.html',
          height: 500
        });
      }
    }];
  },
  
  'card-badges': function(t, options) {
    return t.card('all')
    .then(function(card) {
      return [{
        text: '👋',
        color: 'blue',
      }];
    });
  },

  'card-buttons': function(t, options) {
    return [{
      icon: './icon.png',
      text: 'Open Card',
      callback: function(t) {
        return t.popup({
          title: 'Card Actions',
          items: [
            {
              text: 'Action 1',
              callback: function(t) {
                // Add your action here
              }
            }
          ]
        });
      }
    }];
  },

  'show-settings': function(t, options) {
    return t.popup({
      title: 'Settings',
      items: [
        {
          text: 'Configure Power-Up',
          callback: function(t) {
            return t.modal({
              title: 'Power-Up Settings',
              url: './settings.html',
              height: 300
            });
          }
        }
      ]
    });
  }
}); 