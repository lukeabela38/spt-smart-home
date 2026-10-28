# Samsung TV launcher

A custom Tizen home screen, tested on a Samsung UE75DU7172UXXH (2024).
Six app shortcuts: Netflix, YouTube, Disney+, Apple TV, Apple Music and GO TV.
The cinema theme uses matching dark tiles, clear selection, large text and restrained motion.

## Setup

Install Node.js 18+ and Tizen Studio with Samsung TV and certificate extensions.

```sh
npm ci
cp launcher/config.local.example.js launcher/config.local.js
npm run find-tv
npm run pair
npm run doctor
```

Enable Developer Mode in the TV's Apps settings, enter your computer's local IP,
and fully restart the TV. Create your own Samsung TV signing certificate.
Set `certProfile` in the local `tv.json` to your profile name (or use `CERT_PROFILE`).
Never copy certificates or pairing credentials into Git.

```sh
npm run deploy
```

See [upstream setup instructions](UPSTREAM-README.md) for the detailed SDK and certificate steps.

## Controls

- Left/right selects an app; OK opens it.
- Back twice quickly opens Samsung Home temporarily.
- Channel +/− changes the background.
- Keep Start with Smart Hub Home off and enable Autorun Last App.

The launcher is an app, not a firmware replacement. Samsung Home may appear briefly.
Power-on behaviour depends on the TV firmware and startup settings.

## Verification

```sh
npm run debug
node tools/cinema-test.js
npm run undebug
```

Always run `npm run undebug` after diagnostics, including after a failed test.
The cinema test uses the existing `ws` dependency and direct CDP because this retail TV
rejects Playwright browser-context management. The test checks app selection, layout,
contrast and motion, and saves a screenshot under `shots/`.

See [design notes](DESIGN.md) and [verification summary](VERIFICATION.md).

## Local-only files

`tv.json`, `tv-token.json`, `launcher/config.local.js`, signing certificates,
builds, downloaded artwork and screenshots are excluded from version control.

See [upstream attribution](UPSTREAM.md), [LICENSE](LICENSE) and [NOTICE](NOTICE).
