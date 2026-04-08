const core = require('@actions/core');

const FIELD_MAP = {
  downloads: 'mod_downloads',
  unique_downloads: 'mod_unique_downloads',
  endorsements: 'endorsement_count',
};

const LABEL_MAP = {
  downloads: 'Nexus Downloads',
  unique_downloads: 'Nexus Unique Downloads',
  endorsements: 'Nexus Endorsements',
};

function formatNumber(n) {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(n);
}

async function run() {
  try {
    const nexusApiKey = core.getInput('nexus_api_key', { required: true });
    const game = core.getInput('game', { required: true });
    const modId = core.getInput('mod_id', { required: true });
    const gistId = core.getInput('gist_id', { required: true });
    const gistToken = core.getInput('gist_token', { required: true });
    const type = core.getInput('type') || 'downloads';
    const color = core.getInput('color') || 'DA8E35';
    const label = core.getInput('label') || LABEL_MAP[type];
    const filename = core.getInput('filename') || `${game}-${modId}-${type}.json`;

    if (!FIELD_MAP[type]) {
      core.setFailed(`Invalid type "${type}". Must be one of: downloads, unique_downloads, endorsements`);
      return;
    }

    // Fetch mod data from Nexus Mods API
    core.info(`Fetching stats for ${game}/mods/${modId}...`);
    const nexusResponse = await fetch(
      `https://api.nexusmods.com/v1/games/${game}/mods/${modId}.json`,
      { headers: { apikey: nexusApiKey } }
    );

    if (nexusResponse.status === 401 || nexusResponse.status === 403) {
      core.setFailed('Invalid Nexus Mods API key. Get one at https://www.nexusmods.com/users/myaccount?tab=api');
      return;
    }
    if (nexusResponse.status === 404) {
      core.setFailed(`Mod not found. Check game domain "${game}" and mod ID "${modId}"`);
      return;
    }
    if (nexusResponse.status === 429) {
      core.warning('Nexus Mods API rate limited. Badge not updated this run.');
      return;
    }
    if (!nexusResponse.ok) {
      core.setFailed(`Nexus API error: ${nexusResponse.status} ${nexusResponse.statusText}`);
      return;
    }

    const modData = await nexusResponse.json();
    const field = FIELD_MAP[type];
    const value = modData[field];

    if (value === undefined) {
      core.setFailed(`Field "${field}" not found in API response`);
      return;
    }

    core.info(`${type}: ${value} (${formatNumber(value)})`);

    // Build shields.io endpoint JSON
    const badge = {
      schemaVersion: 1,
      label,
      message: formatNumber(value),
      color,
      namedLogo: 'nexusmods',
      logoColor: 'white',
    };

    // Write to GitHub Gist
    core.info(`Updating gist ${gistId} -> ${filename}`);
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${gistToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        files: { [filename]: { content: JSON.stringify(badge, null, 2) } },
      }),
    });

    if (gistResponse.status === 404) {
      core.setFailed('Gist not found. Create one at https://gist.github.com and use its ID.');
      return;
    }
    if (gistResponse.status === 401 || gistResponse.status === 403) {
      core.setFailed('Gist token invalid or missing gist scope. Create a PAT at https://github.com/settings/tokens with the "gist" scope.');
      return;
    }
    if (!gistResponse.ok) {
      core.setFailed(`Failed to update gist: ${gistResponse.status} ${gistResponse.statusText}`);
      return;
    }

    const gistData = await gistResponse.json();
    const owner = gistData.owner.login;
    const badgeUrl = `https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/${owner}/${gistId}/raw/${filename}`;

    core.setOutput('value', value);
    core.setOutput('badge_url', badgeUrl);

    core.info(`Badge updated! Use in your README:`);
    core.info(`![${label}](${badgeUrl})`);
  } catch (error) {
    core.setFailed(`Unexpected error: ${error.message}`);
  }
}

run();
