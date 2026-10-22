# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Kannada Lipi, please report it
**privately** so it can be fixed before public disclosure.

- **Preferred:** Use GitHub's [private security advisory](../../security/advisories/new)
  feature ("Report a vulnerability").
- **Or:** email support@visionone7.in with "K-Lipi security" in the subject.

Please include:

- A description of the issue and its potential impact
- Steps to reproduce (proof of concept if possible)
- Any suggested fix

Please **do not** open a public issue for security problems.

## Scope

Kannada Lipi is a fully client-side web app — all code runs in the user's
browser and nothing is sent to a server. The most relevant areas are:

- The Kannada interpreter (`src/lib/js/interpreter/`)
- Any handling of user-provided code or URL parameters

## Response

K-Lipi is maintained by [VisionOne7](https://www.visionone7.in). We'll acknowledge
valid reports as soon as we can and credit reporters (unless you prefer to stay
anonymous).
