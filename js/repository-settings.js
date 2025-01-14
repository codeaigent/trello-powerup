var t = TrelloPowerUp.iframe();

// DOM elements
const repoList = document.getElementById('repo-list');
const searchInput = document.getElementById('search');
const saveButton = document.getElementById('save-btn');

let allRepositories = [];
let selectedRepos = new Set();

// Load repositories from backend
async function loadRepositories() {
  try {
    const githubTrelloUserId = await t.get('member', 'private', 'githubTrelloUserId');
    if (!githubTrelloUserId) {
      throw new Error('No githubTrelloUserId found');
    }

    const response = await fetch(`${BACKEND_URL}/github/repositories`, {
      headers: {
        'Authorization': `${githubTrelloUserId}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    allRepositories = await response.json();
    
    // Get previously selected repositories
    const savedRepos = await t.get('board', 'shared', 'primaryRepositories') || [];
    selectedRepos = new Set(savedRepos);

    renderRepositories(allRepositories);
  } catch (error) {
    console.error('Error loading repositories:', error);
    repoList.innerHTML = `<div class="error">Error loading repositories: ${error.message}</div>`;
  }
}

// Render repository list
function renderRepositories(repos) {
  repoList.innerHTML = repos
    .map(repo => `
      <div class="repo-item">
        <input type="checkbox" 
               id="${repo.id}" 
               value="${repo.full_name}"
               ${selectedRepos.has(repo.full_name) ? 'checked' : ''}>
        <label for="${repo.id}">${repo.full_name}</label>
      </div>
    `)
    .join('');

  // Add change listeners to checkboxes
  repoList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedRepos.add(e.target.value);
      } else {
        selectedRepos.delete(e.target.value);
      }
    });
  });
}

// Filter repositories based on search
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRepos = allRepositories.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm)
  );
  renderRepositories(filteredRepos);
});

// Save selected repositories
saveButton.addEventListener('click', async () => {
  try {
    const githubTrelloUserId = await t.get('member', 'private', 'githubTrelloUserId');
    if (!token) {
      throw new Error('GitHub token not found');
    }

    // Save to backend
    const response = await fetch(`${BACKEND_URL}/github/repositories/primary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${githubTrelloUserId}`
      },
      body: JSON.stringify({
        repositories: Array.from(selectedRepos)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save repository settings');
    }

    // Save to board data
    await t.set('board', 'shared', 'primaryRepositories', Array.from(selectedRepos));

    // Show success message
    t.alert({
      message: 'Repository settings saved successfully!',
      duration: 5,
    });
    t.closePopup();
  } catch (error) {
    console.error('Error saving repositories:', error);
    t.alert({
      message: `Error saving repository settings: ${error.message}`,
      duration: 5,
      display: 'error',
    });
  }
});

// Initialize
loadRepositories(); 