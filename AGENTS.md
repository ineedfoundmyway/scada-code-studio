
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.



- Keep presentation language in a React context with explicit translation keys so all simulation views share the selected language.
- Preserve simulation state in each scenario component; language changes must not reset motors or timers.
- Keep source free of explanatory comments; store architecture rules here instead.
