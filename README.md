# SCADA Live

Interactive PLC and electrical control demonstrations in Portuguese and English.

[Open the live presentation](https://ineedfoundmyway.github.io/scada-code-studio/)

## Scenarios

- SCADA architecture, PLCs, industrial networks and I/O.
- Direct-on-line motor starting and reversing controls.
- Star-delta starting and traffic-light sequencing.
- Interactive pushbuttons, indicators, Ladder diagrams and Structured Text.

Educational simulation. The application does not connect to physical equipment.

## Development

Requires Node.js 22.12+ (Node.js 24 is used in CI).

```sh
npm ci
npm run dev
```

The application is a client-side React application built with Vite and Tailwind CSS. It needs no application server, API keys or external editor service.

## Validation

```sh
npm run typecheck
npm run build
npm run preview
```

Open the URL printed by Vite with the `/scada-code-studio/` path. Language changes preserve the current scenario state.

## GitHub Pages

The `Deploy GitHub Pages` workflow builds `dist/` and publishes it after a push to `main`. It can also be started from the Actions tab.

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The deployment uses the `github-pages` environment and only grants Pages write and OIDC permissions to the deployment job.

Assets use the `/scada-code-studio/` base path configured in `vite.config.ts`. Update it if the repository name or hosting path changes.

## Author

[brunnodev](https://brunnodev.store)

## Co-authorship

Include this trailer when crediting a contribution by brunnojob:

```text
Co-authored-by: brunnojob <contato@brunnodev.store>
```
