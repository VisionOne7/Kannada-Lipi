# ಕನ್ನಡ ಲಿಪಿ (K-Lipi)

<div align="center">

![K-Lipi logo](public/images/icon-192.png)

### Karnataka's first programming language in Kannada

**ಕಲಿಯೋಕೆ ಕೋಟಿ ಭಾಷೆ, ಆಡೋಕೆ ಒಂದೇ ಭಾಷೆ**

[**Try it at k-lipi.in**](https://www.k-lipi.in) · [Kids' zone](https://www.k-lipi.in/kids) · [Teachers' guide](https://www.k-lipi.in/teachers) · [Docs](https://www.k-lipi.in/help)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.1.0-D71920.svg)](https://www.k-lipi.in/about)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Free and open source, built by [VisionOne7](https://www.visionone7.in) for Karnataka's schools.

</div>

---

## About

K-Lipi lets you write real programs entirely in Kannada script, with Kannada numerals, keywords and error messages. Children can learn logic in their mother tongue instead of learning English and programming at the same time.

Everything runs in the browser. There are no accounts, no ads and no tracking, and children's progress stays on their own device.

## Features

**For children (Classes 3–8)**
- 🐢 **Turtle drawing:** `ಮುಂದೆ(೧೦೦)`, `ಬಲಕ್ಕೆ(೯೦)`, `ಬಣ್ಣ("ಕೆಂಪು")` and 12 more commands
- 🎯 **ಆಮೆ ಸಾಹಸ:** 12 game levels, from reaching a mango to drawing stars and the Kannada flag
- 🧩 **Block coding:** drag Kannada blocks and see the matching K-Lipi code appear live
- 🎨 **Drawing playground** with ready-made pictures to remix and save as PNG

**For learners**
- 📚 21 interactive lessons with a completion certificate
- 🔥 A daily challenge with streaks, plus coding games
- 💡 Friendly errors in simple Kannada, with line numbers, hints and "did you mean…?"
- ⌨️ On-screen Kannada keyboard and English-to-Kannada typing
- 💾 Save and open programs as `.kl` files, or share them as links

**For schools**
- 👩‍🏫 Teachers' guide with grade-wise tracks, a 40-minute lesson plan and a printable worksheet
- 📴 Installable app that works offline in computer labs
- 🔒 No login and no personal data collected

**Language**
- Variables, arithmetic, conditions, loops, functions and recursion
- Lists, dictionaries (`ನಿಘಂಟು`) and 70+ built-in functions
- `{ }` blocks for multi-line loops, conditions and functions

## Quick start

```
ಮುದ್ರಿಸು("ನಮಸ್ಕಾರ, ಕರ್ನಾಟಕ!")

ಅ = ೧೦
ಆ = ೨೦
ಮುದ್ರಿಸು("ಮೊತ್ತ: " ಅ + ಆ)

# Draw a star
ಬಣ್ಣ("ಹಳದಿ")
ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೫ ವರೆಗೆ: ಮುಂದೆ(೧೫೦) ಬಲಕ್ಕೆ(೧೪೪)

# A function with a multi-line block
ಕಾರ್ಯ ಚೌಕ(ಉದ್ದ): {
    ಪುನರಾವರ್ತನೆ ನ ೧ ರಿಂದ ೪ ವರೆಗೆ: ಮುಂದೆ(ಉದ್ದ) ಬಲಕ್ಕೆ(೯೦)
}
ಚೌಕ(೮೦)
```

The full function reference is on the [Help page](https://www.k-lipi.in/help).

## Development

Requires Node.js 18 or newer.

```bash
git clone https://github.com/VisionOne7/Kannada-Lipi.git
cd Kannada-Lipi
npm install
npm run dev       # start the dev server
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Offline support (the service worker) only runs in production builds.

### Project structure

```
src/
├── lib/js/interpreter/   # lexer, parser, runtime, turtle, friendly errors
├── lib/js/turtleCheck.js # checks kids' level drawings
├── components/           # editor, turtle canvas, Blockly editor, header, footer
├── pages/                # one file per route (Learn, Kids, Teachers, Privacy…)
└── data/                 # lessons, examples, challenges, turtle levels, Karnataka data
public/                   # icons, manifest, service worker, sitemap
```

The site is deployed on Vercel. Security headers and the content security policy live in `vercel.json`.

## Contributing

Developers, teachers and Kannada enthusiasts are all welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Lessons, examples and better Kannada wording are as valuable as code.

To report a security issue, see [SECURITY.md](SECURITY.md).

## Support

If K-Lipi helps you or your school, you can support its development with the **Sponsor** button at the top of this repository, or by starring it and sharing it with a teacher.

## License

[MIT](LICENSE) © 2026 Amoghavarsh Patil. Maintained by [VisionOne7](https://www.visionone7.in).

The Karnataka information on the site is for learning only and is not an official government source.
