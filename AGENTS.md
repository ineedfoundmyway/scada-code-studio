# Project conventions

- Build a static Vite application for GitHub Pages; do not add server-only features.
- Use the configured Vite base for local asset URLs.
- Keep presentation language in a React context with explicit translation keys so all simulation views share the selected language.
- Preserve simulation state in each scenario component; language changes must not reset motors or timers.
- Keep source free of explanatory comments; store architecture rules here instead.
