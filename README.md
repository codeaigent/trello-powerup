# Trello Power-Up

A custom Trello Power-Up that enhances your board's functionality.

## Deployment with GitHub Pages

1. Push this repository to GitHub
2. Go to your repository settings
3. Under "Pages", enable GitHub Pages and select the `gh-pages` branch
4. Wait for the GitHub Action to complete the deployment
5. Your Power-Up will be available at `https://[your-username].github.io/[repo-name]/`

## Setting up the Power-Up in Trello

1. Go to the [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin)
2. Create a new Power-Up
3. Set the iframe connector URL to your GitHub Pages URL: `https://[your-username].github.io/[repo-name]/`
4. Enable the capabilities listed in the manifest.json
5. Add your Power-Up to a Trello board for testing

## Features

- Board buttons for quick actions
- Card badges for additional information
- Card buttons for custom actions
- Settings panel for configuration

## Development

- `manifest.json`: Configure Power-Up metadata and capabilities
- `index.html`: Main entry point and UI
- `client.js`: Power-Up logic and functionality

## Local Testing (Optional)

If you need to test locally before deploying:
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Note: Local testing requires HTTPS, which can be tricky to set up. We recommend using GitHub Pages for development.
