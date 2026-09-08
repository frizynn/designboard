# Security policy

## Supported versions

Security fixes are applied to the latest published release and the `main` branch.

| Version | Supported |
|---|---|
| 0.1.x | Yes |
| Earlier versions | No |

## Report a vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting for this repository. Include the affected version,
impact, reproduction steps, and any suggested mitigation. Reports will be acknowledged on a
best-effort basis, and public disclosure will be coordinated after a fix is available.

## Security model

Designboard treats every artboard as untrusted content. Artboards run inside sandboxed iframes
without same-origin access and communicate with the host through a constrained `postMessage`
protocol. A vulnerability that escapes this boundary, exposes local data, or executes unintended
host actions should be reported privately.
