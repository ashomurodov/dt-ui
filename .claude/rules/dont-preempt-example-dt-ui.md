# Don't preempt example-dt-ui before publish

When you change anything in `e:/Work/dt-ui/src/registry/**` — a new component, a prop change, a bug fix, a one-line CSS tweak — **do not** touch `e:/Work/example-dt-ui` in the same session.

That includes:
- Mirroring registry files into `example-dt-ui/src/components/ui/<comp>/*`
- Switching `example-dt-ui/src/views/components/<X>View.vue` to a new API
- Bumping the `aetherx-dt-ui` dep in `example-dt-ui/package.json`

## Why

The user follows a strict cadence: **registry source → publish → THEN sync example-dt-ui as a real consumer.** Preempting this:
- Couples the local docs site to an unreleased API
- Breaks the deployed Vercel site if pushed
- Creates messy reverts if the registry work is revised before publish
- Hides bugs in the registry source / CLI because the consumer never exercises the published surface

## How to apply

- Stay inside `e:/Work/dt-ui/src/registry/**` until the user explicitly says "published v0.1.X" or similar.
- Update `e:/Work/dt-ui/src/registry/docs/<comp>.md` and `e:/Work/dt-ui/src/registry/registry.json` alongside the component source — those ship together in the same publish.
- Park any example-dt-ui changes mentally; come back to them after the publish.

## Self-check before any write to `e:/Work/example-dt-ui/src/**`

Ask: **is the API I'm using already in `e:/Work/example-dt-ui/node_modules/aetherx-dt-ui/`?**

If not, **STOP.**

"We just published" applies only to the version currently sitting in `node_modules`. Any further registry change is unreleased again until the next publish. Bug-fix follow-ups after a publish are the most common trap — easy to treat them as continuous with the prior "mirror to example" pass, but they aren't.

The local copies under `example-dt-ui/src/components/ui/<comp>/*` should always match what `node_modules/aetherx-dt-ui/src/registry/components/<comp>/*` ships. If a registry change makes them diverge, **the divergence is the bug**, not the fix.
