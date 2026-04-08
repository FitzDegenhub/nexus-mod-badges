# Nexus Mod Badges

GitHub Action that creates live [shields.io](https://shields.io) badges from your [Nexus Mods](https://www.nexusmods.com) stats. Show download counts, unique downloads, and endorsements on your GitHub profile or repo README.

shields.io has no built-in support for nexusmods.com — this Action bridges the gap.

**How it works:** Nexus Mods API → this Action (on a schedule) → GitHub Gist → shields.io endpoint badge → your README

## Quick Start

### 1. Create a GitHub Gist

Go to [gist.github.com](https://gist.github.com) and create a new gist with any filename and content. Copy the **Gist ID** from the URL (the long hash after your username).

### 2. Get your Nexus Mods API key

Go to [Nexus Mods API settings](https://www.nexusmods.com/users/myaccount?tab=api) and copy your **Personal API Key**.

### 3. Create a GitHub PAT

Go to [GitHub Tokens](https://github.com/settings/tokens) and create a token with the **`gist`** scope.

### 4. Add secrets to your repo

In your repo, go to **Settings → Secrets and variables → Actions** and add:
- `NEXUS_API_KEY` — your Nexus Mods API key
- `GIST_TOKEN` — your GitHub PAT with gist scope

### 5. Add the workflow

Create `.github/workflows/nexus-badges.yml`:

```yaml
name: Update Nexus Badges
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:       # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: FitzDegenhub/nexus-mod-badges@v1
        with:
          nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
          game: crimsondesert
          mod_id: 438
          gist_id: YOUR_GIST_ID
          gist_token: ${{ secrets.GIST_TOKEN }}
```

### 6. Add the badge to your README

```markdown
![Nexus Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/crimsondesert-438-downloads.json&style=flat)
```

> The Action logs the exact badge URL after each run — check your workflow output.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `nexus_api_key` | Yes | — | Nexus Mods personal API key |
| `game` | Yes | — | Game domain (e.g. `crimsondesert`, `skyrimspecialedition`) |
| `mod_id` | Yes | — | Nexus Mods mod ID |
| `gist_id` | Yes | — | GitHub Gist ID to store badge JSON |
| `gist_token` | Yes | — | GitHub PAT with `gist` scope |
| `type` | No | `downloads` | `downloads`, `unique_downloads`, or `endorsements` |
| `color` | No | `DA8E35` | Badge color (hex without `#`, or named) |
| `label` | No | Auto | Badge label (derived from type if omitted) |
| `filename` | No | Auto | Gist filename (defaults to `{game}-{mod_id}-{type}.json`) |

## Outputs

| Output | Description |
|--------|-------------|
| `badge_url` | Full shields.io endpoint URL ready to paste |
| `value` | Raw numeric stat value |

## Multiple Mods

Track several mods in one workflow — they all write to the same Gist:

```yaml
steps:
  - uses: FitzDegenhub/nexus-mod-badges@v1
    with:
      nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
      game: crimsondesert
      mod_id: 438
      gist_id: YOUR_GIST_ID
      gist_token: ${{ secrets.GIST_TOKEN }}

  - uses: FitzDegenhub/nexus-mod-badges@v1
    with:
      nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
      game: crimsondesert
      mod_id: 438
      gist_id: YOUR_GIST_ID
      gist_token: ${{ secrets.GIST_TOKEN }}
      type: endorsements
```

## Multiple Stats

Show downloads and endorsements side by side:

```markdown
![Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/USER/GIST_ID/raw/crimsondesert-438-downloads.json&style=flat)
![Endorsements](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/USER/GIST_ID/raw/crimsondesert-438-endorsements.json&style=flat)
```

## Number Formatting

| Raw Value | Displayed |
|-----------|-----------|
| 842 | `842` |
| 3,500 | `3.5k` |
| 15,000 | `15k` |
| 1,200,000 | `1.2M` |

## License

MIT
