# The Glucose Games

## Setup

```bash
npm install
```

### Setup Supabase (Database and Auth)

Create an account at [Supabase](https://supabase.com/)

Create a project and retrieve your SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY

Create a `.env.local` file in the root of the project and add the following:

```.dotenv
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

Then link with the Supabase CLI:

```bash
npx supabase login
npx supabase link
npx supabase db push
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
supabase migration new name_of_migration
```

Diff the local database against the Supabase one and paste its contents into the migration file:

```bash
supabase db diff
```

Push changes to Supabase:

```bash
supabase db push
```

## Contributing

If you would like to contribute to this project, please follow the [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is a source available project.
You are free to run the software for yourself, but you are not allowed to redistribute it or sell it.

This project is licensed under the PolyForm Perimeter 1.0.1 License - see the [LICENSE](LICENSE) file for details.
