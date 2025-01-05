# Setup Guide

This guide covers the setup process for the CodeAIgent Trello Power-Up.

## Prerequisites

1. GitHub account
2. Trello account
3. Node.js installed locally
4. Basic understanding of JavaScript and Trello Power-Ups

## Initial Setup

### 1. Trello Power-Up Registration

1. Go to [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin)
2. Click "New" to create a new Power-Up
3. Fill in the required information:
   - Name: CodeAIgent
   - Author: Your Name
   - Overview: AI-powered code assistant for Trello
   - Capabilities:
     - `authorization-status`
     - `show-authorization`
     - `card-buttons`
4. Save and note down your API key

### 2. Bot Account Setup

1. Create a new Trello account for the bot:
   - Email: bot@codeaigent.com (or your chosen email)
   - Username: codeaigent
   - Name: CodeAIgent Bot
2. Keep the bot's credentials secure

### 3. Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/codeaigent/trello-powerup.git
   cd trello-powerup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (for development):
   ```
   TRELLO_API_KEY=your_api_key_here
   BOT_EMAIL=bot@codeaigent.com
   ```

## GitHub Configuration

### 1. Repository Settings

1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `TRELLO_API_KEY`: Your Power-Up API key
   - `BOT_EMAIL`: Your bot's email address

### 2. GitHub Pages Setup

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Save

## Development Environment

### Local Development

1. Start the development server:
   ```bash
   npm start
   ```

2. Access the Power-Up at:
   ```
   http://localhost:8080
   ```

### Testing in Trello

1. Go to Trello Power-Up Admin Portal
2. Add your development URL to "Allowed Origins":
   - `http://localhost:8080`
   - `https://yourusername.github.io`

## File Structure

```
trello-powerup/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
├── docs/                 # Documentation
├── .env                  # Local environment variables
├── .gitignore           # Git ignore rules
├── auth.html            # Authorization page
├── auth-success.html    # Authorization callback
├── client.js            # Main Power-Up code
├── config.js            # Configuration (generated)
├── index.html           # Main entry point
├── manifest.json        # Power-Up manifest
└── README.md           # Project overview
```

## Deployment

The Power-Up is automatically deployed to GitHub Pages when changes are pushed to the main branch.

1. Push changes:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. GitHub Actions will:
   - Build the project
   - Inject secrets
   - Deploy to GitHub Pages

3. Access your Power-Up at:
   ```
   https://yourusername.github.io/trello-powerup/
   ```

## Verification

1. Open a Trello board
2. Add the Power-Up
3. Click the CodeAIgent button
4. Verify authorization works
5. Test bot integration by mentioning @codeaigent

## Troubleshooting

1. **CORS Issues**
   - Verify allowed origins in Power-Up settings
   - Check browser console for errors
   - Ensure URLs match exactly

2. **Deployment Issues**
   - Check GitHub Actions logs
   - Verify secrets are set correctly
   - Ensure gh-pages branch exists

3. **Bot Integration Issues**
   - Verify bot account exists
   - Check bot email in settings
   - Ensure proper permissions 