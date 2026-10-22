# Contributing to ಕನ್ನಡ ಲಿಪಿ (Kannada Lipi)

First off — thank you for your interest in contributing! 🎉
Kannada Lipi is built **for Kannadigas, by Kannadigas**, and community help is
very welcome — whether it's code, new lessons/examples, Kannada translations,
bug reports, or documentation.

## Ways to contribute

- 🐛 **Report bugs** — open an [issue](../../issues) with steps to reproduce
- 💡 **Suggest features** — open an issue describing the idea and why it helps
- 📚 **Add content** — new lessons, code examples, or Karnataka data
- 🌐 **Improve Kannada** — fix wording, typos, or translations
- 🧑‍💻 **Fix code** — pick an open issue and send a pull request

## Getting started

**Prerequisites:** Node.js `>=18`.

```bash
# 1. Fork github.com/VisionOne7/Kannada-Lipi, then clone your fork
git clone https://github.com/<your-username>/Kannada-Lipi.git
cd Kannada-Lipi

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Build to verify your change compiles before opening a PR
npm run build
```

## Pull request process

1. **Create a branch** off `main` — never commit directly to `main`:
   `git checkout -b fix/short-description`
2. Make your change. Keep it focused — one logical change per PR.
3. **Match the existing style** — look at nearby files for naming, formatting,
   and how Kannada strings are written.
4. **Run `npm run build`** and make sure it passes.
5. Commit with a clear message and open a PR against `main`.
6. Fill out the PR template and describe what you changed and why.

## Project structure

```
src/
├── components/         Reusable UI (CodeEditor, Header, Footer, ...)
├── pages/              Route pages (Home, Learn, Examples, Karnataka, ...)
├── data/               Content data (lessons, examples, schemes, wonders, ...)
└── lib/js/interpreter/ The Kannada language interpreter (lexer, parser, runtime)
```

- **Adding a lesson/example?** Edit the relevant file in `src/data/` — no React
  knowledge needed.
- **Changing the language itself?** That lives in `src/lib/js/interpreter/`.

## Guidelines

- Be respectful — see our [Code of Conduct](CODE_OF_CONDUCT.md).
- Don't add dependencies unless necessary; explain why in the PR.
- Don't introduce network calls or tracking — this project runs fully in the
  browser and stays privacy-first.
- Don't commit secrets, `.env` files, or build output (`dist/`).

## Questions?

Open an issue or start a discussion. Happy to help newcomers get started!
