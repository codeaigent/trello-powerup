var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var authBtn = document.getElementById('auth-btn');
authBtn.addEventListener('click', function() {
  // Get context first
  Promise.all([
    t.getContext(),
    t.arg('callback')
  ]).then(([context, callback]) => {
    // GitHub OAuth flow
    const githubAuthUrl = 'https://github.com/login/oauth/authorize';
    const clientId = 'Iv23liFtRuiAll1ckg4i';
    const scope = 'repo read:user';
    const state = Math.random().toString(36).substring(7); // Generate random state
    
    // Build redirect URI with context parameters
    const redirectUri = new URL(`${window.location.origin}/trello-powerup/github-auth-success.html`);
    redirectUri.searchParams.append('boardId', context.board);
    redirectUri.searchParams.append('memberId', context.member);

    // Store state for validation
    t.set('member', 'private', 'githubOAuthState', state)
      .then(function() {
        // Open GitHub auth in a new window
        const width = 580;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const authWindow = window.open(
          `${githubAuthUrl}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri.toString()}&state=${state}`,
          'GitHubAuth',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Close the popup that opened the auth window
        t.closePopup();
      });
  });
}); 