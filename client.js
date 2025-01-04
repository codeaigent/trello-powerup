/* global TrelloPowerUp */

console.log('Power-Up initializing...'); // Debug log

// This is the main initialization function that Trello will call
window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    console.log('card-buttons capability called', options); // Debug log
    return [{
      icon: {
        dark: './icon-dark.png',
        light: './icon-light.png'
      },
      text: 'Card Action',
      callback: function(t) {
        console.log('card button clicked'); // Debug log
        return t.popup({
          title: 'Card Actions',
          items: [
            {
              text: 'Action 1',
              callback: function(t) {
                console.log('Action 1 clicked'); // Debug log
                return t.alert({
                  message: 'Action clicked!',
                  duration: 3
                });
              }
            }
          ]
        });
      }
    }];
  }
}); 