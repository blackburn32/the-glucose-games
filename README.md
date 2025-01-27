# The Glucose Games

## Setup

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Principles

Avoid storing health data if at all possible.

Store the minimum amount of data possible.

## Database

This project uses Supabase.

You can generate types for the Supabase client by running:

```bash
supabase gen types typescript --local > types/database.glucoseRecord.ts
```
