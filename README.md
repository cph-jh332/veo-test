# VeoTest

I'm using NX as a monorepo for this project, so that I can share libraries between the frontend and backend.

## Installation

run `npm install` in the root directory to install all dependencies.

```bash
npm install
```

## Running the backend

```bash
npx nx serve server
```

## Running the frontend

```bash
npx nx serve frontend
```

## Running the frontend and backend together

```bash
npx nx run-many --target=serve --projects="frontend,server" --parallel
```

## Viewing the frontend

The frontend is served on port 4200, so you can view it at http://localhost:4200

## Technologies

- NX
- React
- Express
- TypeScript
- TRPC
- TailwindCSS
- FontAwesome
