var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var authBtn = document.getElementById('auth-btn');
authBtn.addEventListener('click', function() {
  // GitHub OAuth flow
  const githubAuthUrl = 'https://github.com/login/oauth/authorize';
  const clientId = `${CLIENT_ID}`;
  const scope = 'repo read:user';
  const redirectUri = `${window.location.origin}/github-auth-success.html`;
  const state = Math.random().toString(36).substring(7); // Generate random state

  // Store state for validation
  t.set('member', 'private', 'githubOAuthState', state)
    .then(function() {
      window.location.href = `${githubAuthUrl}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
    });
}); 