# Use the CLI to sync example-dt-ui — don't `cp` from node_modules

When syncing `e:/Work/example-dt-ui` after a published version bump, use the real `dt-ui` CLI commands:

```bash
npm install aetherx-dt-ui@latest   # gets the new registry into node_modules
npx dt-ui update                   # interactive multi-select, tick what to overwrite
# or
npx dt-ui add <new-component>      # for fresh additions
```

**Do NOT** shortcut with `cp node_modules/aetherx-dt-ui/src/registry/components/<x>/*.vue src/components/ui/<x>/`.

## Why

`example-dt-ui` doubles as the **dogfood test** for our own CLI. Every consumer-update flow in the wild looks like `npm install` + `npx dt-ui update`. If we never exercise that path ourselves, we have no signal that:
- `update` correctly diffs installed components against the new registry
- The interactive multi-select renders the right components and file counts
- Shared files (`base.css`, `table-cells.css`, `lib/utils.ts`) refresh cleanly
- Peer-dep installs trigger on the right components
- `AGENT.md` rebuilds correctly

A silent `cp` produces the same end state on disk but **proves nothing about the CLI**. If `update` is broken, we'd only find out from a confused consumer — not from our own workflow.

## How to apply

- After the user signals a publish, run `npm install aetherx-dt-ui@latest` (or bump the version pin + `npm install`), then run `npx dt-ui update` (or `add` for new components).
- The CLI is interactive — when I can't drive it through this tool (no TTY in non-interactive shells), do the prep (revert local mirror, install latest, confirm node_modules has the new version) and hand the actual `npx dt-ui update` step to the user in PowerShell. Don't skip it by `cp`-ing.
- The exception is `add <new>` when the component doesn't exist locally yet — but even then prefer `npx dt-ui add` if a real terminal is available; it tests the CLI's dep-resolution and peer-install paths.

## Self-check before any direct file copy from `node_modules/aetherx-dt-ui/`

Ask: **is there a CLI command that would produce the same effect?**

If yes, use the CLI. The few seconds saved by `cp` aren't worth losing the end-to-end test of our own product.
