# Tooling Workflow

## Playwright CLI

Load the `playwright-cli` skill when browser verification is needed for UI implementation, responsive layouts, navigation, forms, authentication flows, CRUD behavior, or browser console and network errors. Do not use it for static code inspection or when existing unit tests provide sufficient evidence.

Use `playwright-cli` with snapshots as the primary inspection method. Take screenshots only when visual evidence is necessary. Verify the relevant behavior at desktop and mobile viewports, inspect console and network errors when applicable, and close the browser session when finished. Do not replace the project's existing test configuration.

## Strix

Load the most specific Strix skill for authorized security work:

- `penetration-testing-with-strix` for a general authorized pentest.
- `web-app-penetration-testing` for an authorized local or staging web application.
- `api-security-testing` for an authorized API, API contract, or access-control review.
- `find-security-vulnerabilities-in-code` for a source-level review.
- `fix-security-vulnerabilities-with-strix` to remediate validated Strix findings.

Never launch an active Strix scan without the user's explicit authorization, target scope, and confirmation that the target is a local or staging environment they are authorized to test. Do not run scans automatically after code changes. Use non-interactive mode with an explicit budget, and prefer a clean checkout because local code targets are writable inside Strix's sandbox.

Report browser verification as the actions performed and observed result. Report security findings by severity with affected target, validated evidence or reproduction reference, impact, remediation, and scan limitations. Never include credentials, API keys, session data, or proof-of-concept details that expose secrets.
