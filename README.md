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

### Generating Types

You can generate types for the Supabase client by running:

```bash
supabase gen types typescript --local > types/database.types.ts
```

### Pushing Local Database to Supabase

Do whatever you want in the local database.

Create a migration:

```bash
supabase migration create new name_of_migration
```

Diff the local database against the Supabase one and paste its contents into the migration file:

```bash
supabase db diff
```

Push changes to Supabase:

```bash
supabase db push
```
