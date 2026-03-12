# CLI Reference

## `npx dt-ui init`

Initialize dt-ui in your project. Interactive setup flow that:

- Detects your framework (Nuxt, Vue + Vite, or plain Vue)
- Configures component and lib directories
- Copies `base.css` design tokens
- Copies `lib/utils.ts` shared helper
- Optionally creates `AGENT.md`
- Creates `.dtui.json` config file

### Config File

The `.dtui.json` file tracks your configuration:

```json
{
  "framework": "vue-vite",
  "componentsDir": "src/components/ui",
  "libDir": "src/lib",
  "stylesDir": "src/styles",
  "installedComponents": ["button", "card"],
  "agent": true
}
```

## `npx dt-ui add <component> [component2] [...]`

Add one or more components to your project.

```bash
# Add a single component
npx dt-ui add button

# Add multiple components
npx dt-ui add card badge dialog

# Interactive picker (no arguments)
npx dt-ui add
```

**Behavior:**

- Resolves internal dependencies (e.g., `dialog` requires `button`)
- Prompts before overwriting existing components
- Copies files into your configured components directory
- Installs npm peer dependencies if needed
- Updates `.dtui.json` installed components list
- Appends component docs to `AGENT.md` if enabled

## `npx dt-ui list`

Show all available components with install status.

```bash
npx dt-ui list
```

Displays a table with component names, descriptions, and checkmarks for installed components.
