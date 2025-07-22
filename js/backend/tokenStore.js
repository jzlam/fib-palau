const fs = require('fs');
const path = require('path');
const tokenFile = path.resolve(__dirname, 'box_tokens.json');

function saveTokens({ access_token, refresh_token }) {
  fs.writeFileSync(tokenFile, JSON.stringify({ access_token, refresh_token }));
}

function loadTokens() {
  if (!fs.existsSync(tokenFile)) return null;
  const raw = fs.readFileSync(tokenFile);
  return JSON.parse(raw);
}

module.exports = { saveTokens, loadTokens };
