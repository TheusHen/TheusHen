# TheusHen Portfolio

Personal portfolio and GitHub profile for Matheus Henrique (TheusHen), a Brazilian student engineer building open-source hardware, artificial intelligence, networking and aerospace projects.

[Open the portfolio](https://www.theushen.works) · [Projects](https://www.theushen.works/projects) · [Contact](https://www.theushen.works/contact)

## Highlights

- Curated project portfolio instead of an unfiltered repository dump
- English and Portuguese interface
- Accessible controls, focus states and reduced-motion support
- Cached GitHub repository, gist and star APIs
- Route-specific metadata, canonical URLs, sitemap and structured data
- Continuous validation with ESLint, TypeScript and a production build

## Local development

Requirements:

- Node.js 22
- npm 10 or newer

```bash
git clone https://github.com/TheusHen/TheusHen.git
cd TheusHen
npm ci
npm run dev
```

Open `http://localhost:3000`.

An optional `GITHUB_TOKEN` can be configured to increase the GitHub API rate limit. Copy `.env.example` to `.env.local` and add a fine-grained read-only token if needed.

## Validation

```bash
npm run lint
npm run type-check
npm run build
```

The same checks run for every pull request through GitHub Actions.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Introduction and selected work |
| `/projects` | Curated repositories and public gists |
| `/timeline` | Project and community milestones |
| `/decisions` | University application planning |
| `/contact` | Public contact links |
| `/donate` | Optional support for independent projects |

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Vercel Analytics and Speed Insights

## License

The source code is available under the terms in [LICENSE](LICENSE). Project names, personal content and third-party assets retain their respective rights.

<img src="https://raw.githubusercontent.com/TheusHen/TheusHen/output/snake.svg" alt="GitHub contribution animation" />
