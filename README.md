# Aman Javed — Portfolio

Personal engineering portfolio. Electrical Engineering at Aligarh Muslim University, focused on
robotics, control systems, embedded systems and PCB design.

Built with **React 19**, **TypeScript**, **Vite** and **Tailwind CSS**.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Other commands

```bash
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
```

## Project structure

```
src/
├── data/
│   ├── profile.ts      # bio, education, experience, skills — edit content here
│   └── projects.ts     # all project content, one object per project
├── components/         # Navbar, ProjectCard, ProjectDetails, Diagram, Timeline, …
├── sections/           # Hero, About, Skills, Projects, Resume, Contact
└── hooks/              # scroll reveal, scroll spy

public/
├── docs/               # résumé PDF served by the download button
└── projects/           # project imagery (webp)

resume-src/             # résumé source + PDF generator
```

All content lives in `src/data/`. Adding a project means appending one object to the `projects`
array in `src/data/projects.ts` — no component changes needed.

## Updating the résumé

Edit `resume-src/cv.html`, then regenerate the PDF. The generator drives headless Chromium via
Playwright, which is not a project dependency, so install it first:

```bash
npm i -D playwright && npx playwright install chromium
node resume-src/build-cv.mjs
```

This writes to `public/docs/Aman_Javed_CV.pdf`, which the site serves. Alternatively, drop your own
PDF at that path using the same filename.

## Before deploying

Replace the placeholder canonical/Open Graph URLs in `index.html` (search for
`REPLACE-WITH-YOUR-DOMAIN`) with the real deployed URL, or link previews will be wrong.

## Deployment

Configured for Vercel (`vercel.json`), Netlify (`netlify.toml`) and GitHub Pages
(`.github/workflows/deploy.yml`).

```bash
vercel --prod
```

For GitHub Pages served from a subpath, build with the base path set:

```bash
BASE_PATH=/portfolio/ npm run build
```

## Note on confidential work

Two hardware projects are listed by name and engineering role only. They were developed under a
non-disclosure agreement, and schematics, layout, bill of materials and repository access are
deliberately withheld.
