# Work AI Platform Page (Copy)

This is a code bundle for Work AI Platform Page (Copy). The original project is available at https://www.figma.com/design/zASiaUIsjKPHqO2Ier33QY/Work-AI-Platform-Page--Copy-.

## Project structure

```
├── src/                 # Source code (React, components)
├── public/              # Static assets (logos, images)
├── docs/                # Documentation (for-agents, press-release, etc.)
├── scripts/             # Utility scripts (backup, migration, logo download)
├── sql/                 # SQL schemas and migrations
├── guidelines/          # Design guidelines
├── index.html
├── package.json
└── vite.config.ts
```

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Scripts

- `node scripts/backup.cjs save [name]` — Create a backup
- `node scripts/backup.cjs list` — List backups
- `node scripts/backup.cjs restore [id]` — Restore from backup
- `node scripts/download-logos.cjs` — Download AI company logos to `public/logos/`
  