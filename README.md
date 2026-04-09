<div align="center">

# Nexus Mod Badges

**Live Nexus Mods stats on your GitHub profile**

![shields.io](https://img.shields.io/badge/shields.io-endpoint-DA8E35?style=flat)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-automated-2088FF?style=flat&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

GitHub Action that creates live [shields.io](https://shields.io) badges from your [Nexus Mods](https://www.nexusmods.com) stats.
Show download counts, unique downloads, and endorsements on your GitHub profile or repo README.

shields.io has no built-in support for nexusmods.com — this Action bridges the gap.

</div>

---

## Demo

Real badge powered by this Action:

| Mod | Badge |
|-----|-------|
| [Ultimate Camera Mod](https://www.nexusmods.com/crimsondesert/mods/438) — Crimson Desert | ![Nexus Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/crimsondesert-438-downloads.json&style=flat) |

### Supported Stats

| Type | Description | Example Label |
|------|-------------|---------------|
| `downloads` | Total download count (default) | Nexus Downloads |
| `unique_downloads` | Unique user downloads | Nexus Unique Downloads |
| `endorsements` | Community endorsement count | Nexus Endorsements |

> **Note:** Nexus Mods does not expose view counts through their API. These three stats are everything available.

**Works with any game on Nexus Mods.** Here's what your badges would look like:

| Game | Mod | Type | What you'd see |
|------|-----|------|----------------|
| Skyrim SE | [SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604) | `downloads` | ![Downloads](https://img.shields.io/badge/Nexus_Downloads-42.1M-DA8E35?style=flat) |
| Elden Ring | [Seamless Co-op](https://www.nexusmods.com/eldenring/mods/510) | `unique_downloads` | ![Unique](https://img.shields.io/badge/Nexus_Unique_Downloads-12.3M-DA8E35?style=flat) |
| Baldur's Gate 3 | [Script Extender](https://www.nexusmods.com/baldursgate3/mods/2172) | `endorsements` | ![Endorsements](https://img.shields.io/badge/Nexus_Endorsements-48.2k-DA8E35?style=flat) |
| Elden Ring | [ER Reforged](https://www.nexusmods.com/eldenring/mods/541) | `downloads` | ![Downloads](https://img.shields.io/badge/Nexus_Downloads-2.1M-DA8E35?style=flat) |

### Logo Options

Control how the badge looks with the `logo` input:

| Mode | Setting | Preview |
|------|---------|---------|
| Icon + Text | `logo: both` (default) | ![both](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/crimsondesert-438-downloads.json&style=flat) |
| Icon only | `logo: icon` | ![icon](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/demo-icon.json&style=flat&cacheSeconds=3600) |
| Text only | `logo: text` | ![text](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/demo-text.json&style=flat&cacheSeconds=3600) |
| None | `logo: none` | ![none](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/demo-none.json&style=flat&cacheSeconds=3600) |

> These are live previews powered by this Action.

---

## How It Works

```
Nexus Mods API  →  This Action (daily)  →  GitHub Gist  →  shields.io  →  Your README
```

The Action runs on a schedule via GitHub Actions, fetches your mod's stats from the Nexus Mods API, saves them to a GitHub Gist, and shields.io reads from that Gist to display a live badge.

**Cost:** Completely free. GitHub Actions, Gists, shields.io, and the Nexus Mods API are all free.

---

## Setup Guide

> This guide assumes you've never done any of this before. Follow each step exactly.
>
> **Before you start**, open a notepad/text file to temporarily save keys and IDs as you go. You'll need them in later steps.

<details>
<summary><strong>Step 1: Get your Nexus Mods API Key</strong></summary>

<br>

Your API key lets this Action read your mod's public stats (downloads, endorsements, etc). It does **not** give access to modify anything.

1. Log in to [nexusmods.com](https://www.nexusmods.com)
2. Click your **profile picture** (top right) → **Site preferences**
3. Click the **API Keys** tab
4. Scroll down to **Personal API Key**
5. Copy the key and **paste it into your notepad file** — you'll need it in Step 4

</details>

<details>
<summary><strong>Step 2: Create a GitHub Gist</strong></summary>

<br>

A Gist is a small file hosted on GitHub. This Action writes your mod stats to a Gist, and shields.io reads from it to display your badge.

1. Go to [gist.github.com](https://gist.github.com)
2. In the **Filename** box, type: `nexus-badges.json`
3. In the big text area below, type: `{}`
4. Click **Create public gist**
5. Look at the URL in your browser — it will look like:
   ```
   https://gist.github.com/YourUsername/abc123def456789...
   ```
6. Copy the **long string of letters and numbers after your username** — that's your **Gist ID**. **Paste it into your notepad file** — you'll need it in Steps 6 and 8.

</details>

<details>
<summary><strong>Step 3: Create a GitHub Personal Access Token (PAT)</strong></summary>

<br>

A PAT is a password-like token that gives the Action permission to update your Gist.

1. Go to [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) (Fine-grained tokens)
2. Click **Generate new token**
3. Give it a name like `Nexus Badges`
4. Set an expiration (e.g. 90 days — you'll need to regenerate it when it expires)
5. Under **Account permissions**, click **+ Add permissions**
6. Find **Gists** and set it to **Read and write**
7. Click **Generate token**
8. **Copy the token immediately** and **paste it into your notepad file** — you won't be able to see it again

> **Important:** Never paste tokens into chat, code, or files. They go into GitHub Secrets (next step) where they're encrypted.

</details>

<details>
<summary><strong>Step 4: Add Secrets to Your Repository</strong></summary>

<br>

Secrets are encrypted values that your workflow can use without exposing them publicly.

1. Go to your GitHub repository (the one where you want the badge)
2. Click **Settings** (tab along the top of the repo)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
   - **Name:** `NEXUS_API_KEY`
   - **Secret:** paste your Nexus Mods API key from Step 1
   - Click **Add secret**
5. Click **New repository secret** again
   - **Name:** `GIST_TOKEN`
   - **Secret:** paste your GitHub PAT from Step 3
   - Click **Add secret**

You should now see both secrets listed.

</details>

<details>
<summary><strong>Step 5: Find Your Game Domain and Mod ID</strong></summary>

<br>

You need two values from your Nexus Mods page. Look at your mod's URL:

```
https://www.nexusmods.com/crimsondesert/mods/438
                         ^^^^^^^^^^^^^^      ^^^
                         game domain          mod ID
```

- **Game domain** = the part after `nexusmods.com/` (e.g. `crimsondesert`, `skyrimspecialedition`, `baldursgate3`)
- **Mod ID** = the number at the end

**Paste both into your notepad file** — you'll need them in Steps 6 and 8.

</details>

<details>
<summary><strong>Step 6: Add the Workflow File</strong></summary>

<br>

This file tells GitHub to run the Action on a daily schedule.

1. In your repository, create the folder path `.github/workflows/` (if it doesn't exist)
2. Create a new file called `nexus-badges.yml` inside that folder
3. Paste the following — you need to **replace 3 placeholder values** (explained below):

```yaml
name: Update Nexus Badges
on:
  schedule:
    - cron: '0 6 * * *'  # Runs daily at 6:00 AM UTC
  workflow_dispatch:       # Allows you to run it manually from the Actions tab

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: FitzDegenhub/nexus-mod-badges@v1
        with:
          nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
          game: YOUR_GAME_DOMAIN
          mod_id: YOUR_MOD_ID
          gist_id: YOUR_GIST_ID
          gist_token: ${{ secrets.GIST_TOKEN }}
```

4. **Replace these 3 values** with your own from your notepad file:

| Placeholder | Replace with | Where you got it |
|-------------|-------------|------------------|
| `YOUR_GAME_DOMAIN` | Your game's URL slug (e.g. `crimsondesert`, `skyrimspecialedition`) | Step 5 — from your Nexus Mods URL |
| `YOUR_MOD_ID` | Your mod's ID number (e.g. `438`) | Step 5 — the number at the end of your mod URL |
| `YOUR_GIST_ID` | The long hash from your Gist URL (e.g. `8252b6a9bc70cedffb883127f64c8ee6`) | Step 2 — from your Gist URL |

> **Do NOT change** `${{ secrets.NEXUS_API_KEY }}` or `${{ secrets.GIST_TOKEN }}` — leave them exactly as they are. GitHub automatically fills these in from the secrets you added in Step 4.

5. Commit the file to your repo

**Optional inputs** you can add to customize your badge:

| Input | What it does | Example |
|-------|-------------|---------|
| `type` | Change the stat shown | `type: endorsements` |
| `logo` | Control the logo display | `logo: icon` (icon only, no text) |
| `color` | Change the badge color | `color: blue` |
| `label` | Custom label text | `label: "My Mod Downloads"` |

For example, to show endorsements with icon only:

```yaml
      - uses: FitzDegenhub/nexus-mod-badges@v1
        with:
          nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
          game: crimsondesert
          mod_id: 438
          gist_id: YOUR_GIST_ID
          gist_token: ${{ secrets.GIST_TOKEN }}
          type: endorsements
          logo: icon
```

You can add **multiple steps** in the same workflow to create badges for different stats or mods — they all write to the same Gist. See the [Examples](#examples) section below.

</details>

<details>
<summary><strong>Step 7: Run It for the First Time</strong></summary>

<br>

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. On the left, click **Update Nexus Badges**
4. Click **Run workflow** → **Run workflow**
5. Wait a few seconds for it to complete (you'll see a green checkmark)

If it fails, check the error message and refer to the [Troubleshooting](#troubleshooting) section.

</details>

<details>
<summary><strong>Step 8: Add the Badge to Your README</strong></summary>

<br>

Now add the badge image to your `README.md`. Replace `YOUR_USERNAME` and `YOUR_GIST_ID` with your values.

The filename at the end follows the pattern `{game}-{mod_id}-{type}.json`. If you didn't set a `type`, it defaults to `downloads`.

```markdown
![Nexus Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/YOUR_GAME-YOUR_MOD_ID-downloads.json&style=flat)
```

**Example** (for a Crimson Desert mod with ID 438):
```markdown
![Nexus Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FitzDegenhub/8252b6a9bc70cedffb883127f64c8ee6/raw/crimsondesert-438-downloads.json&style=flat)
```

If you used a different `type` (e.g. `endorsements`), change the filename accordingly:
```markdown
![Nexus Endorsements](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/YOUR_GAME-YOUR_MOD_ID-endorsements.json&style=flat)
```

If you set a custom `filename` in your workflow, use that exact filename in the URL instead.

> **Tip:** The Action logs the exact badge URL after each run. Go to the Actions tab → click the latest run → expand the step output to see it.

</details>

<br>

That's it! The badge auto-updates every day. You never need to touch it again (until your PAT expires — then just regenerate and update the `GIST_TOKEN` secret).

**Delete your notepad file** now — you don't need those keys anymore and they shouldn't be left lying around.

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `nexus_api_key` | Yes | — | Nexus Mods personal API key |
| `game` | Yes | — | Game domain (e.g. `crimsondesert`, `skyrimspecialedition`) |
| `mod_id` | Yes | — | Nexus Mods mod ID |
| `gist_id` | Yes | — | GitHub Gist ID to store badge JSON |
| `gist_token` | Yes | — | GitHub PAT with `gist` scope |
| `type` | No | `downloads` | `downloads`, `unique_downloads`, or `endorsements` |
| `color` | No | `DA8E35` | Badge color (hex without `#`, or named color) |
| `label` | No | Auto | Badge label text (derived from type if omitted) |
| `logo` | No | `both` | Logo display: `both`, `icon`, `text`, or `none` |
| `filename` | No | Auto | Gist filename (defaults to `{game}-{mod_id}-{type}.json`) |

## Outputs

| Output | Description |
|--------|-------------|
| `badge_url` | Full shields.io endpoint URL ready to paste |
| `value` | Raw numeric stat value |

---

## Examples

### Multiple Mods

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
      game: skyrimspecialedition
      mod_id: 12345
      gist_id: YOUR_GIST_ID
      gist_token: ${{ secrets.GIST_TOKEN }}
```

### Multiple Stats for One Mod

Show downloads and endorsements side by side:

```yaml
steps:
  - uses: FitzDegenhub/nexus-mod-badges@v1
    with:
      nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
      game: crimsondesert
      mod_id: 438
      gist_id: YOUR_GIST_ID
      gist_token: ${{ secrets.GIST_TOKEN }}
      type: downloads

  - uses: FitzDegenhub/nexus-mod-badges@v1
    with:
      nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
      game: crimsondesert
      mod_id: 438
      gist_id: YOUR_GIST_ID
      gist_token: ${{ secrets.GIST_TOKEN }}
      type: endorsements
```

Then in your README:
```markdown
![Downloads](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/USER/GIST_ID/raw/crimsondesert-438-downloads.json&style=flat)
![Endorsements](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/USER/GIST_ID/raw/crimsondesert-438-endorsements.json&style=flat)
```

### Custom Logo, Color, and Label

```yaml
- uses: FitzDegenhub/nexus-mod-badges@v1
  with:
    nexus_api_key: ${{ secrets.NEXUS_API_KEY }}
    game: crimsondesert
    mod_id: 438
    gist_id: YOUR_GIST_ID
    gist_token: ${{ secrets.GIST_TOKEN }}
    logo: icon           # icon only, no label text
    color: blue          # change badge color
    label: "My Mod"      # custom label (only shows if logo is 'both' or 'text')
```

---

## Number Formatting

| Raw Value | Displayed |
|-----------|-----------|
| 842 | `842` |
| 3,500 | `3.5k` |
| 15,000 | `15k` |
| 1,200,000 | `1.2M` |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Input required and not supplied: gist_token` | You haven't added the `GIST_TOKEN` secret. See Step 4. |
| `Invalid Nexus Mods API key` | Your API key is wrong or expired. Get a new one from Step 1. |
| `Mod not found` | Check your `game` and `mod_id` values match your Nexus Mods URL. See Step 5. |
| `Gist not found` | Your `gist_id` is wrong. Double-check the ID from Step 2. |
| `Gist token invalid or missing gist scope` | Your PAT doesn't have Gist permissions. Redo Step 3. |
| Badge shows "invalid" or "inaccessible" | The workflow hasn't run yet. Go to Actions tab and trigger it manually (Step 7). |
| Badge shows "resource not found" | Shields.io is caching an old response. Wait ~5 minutes and hard refresh (`Ctrl+Shift+R`). |
| Badge not updating | Shields.io caches badges for ~5 minutes. Wait and refresh. |

---

## License

MIT
