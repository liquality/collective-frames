This is a Collective Frames builder project from Liquality.

## Getting Started

### Database

- Local Database

1. You should has up and running a local instance of postgresql

- Mac / Homebrew: [https://wiki.postgresql.org/wiki/Homebrew](https://wiki.postgresql.org/wiki/Homebrew)
  POSTGRES_URL=""
- Linux: [https://w3resource.com/PostgreSQL/install-postgresql-on-linux-and-windows.php](https://w3resource.com/PostgreSQL/install-postgresql-on-linux-and-windows.php)

2. create the local database: `createdb collective_frames`
3. connect to the database: `psql collective_frames`
4. create role and password `CREATE ROLE collective_frames WITH LOGIN PASSWORD 'my_secure_password';`
5. Run migration `npm run migrate:run`;
6. Run drizzle studio to alter and check the tables `npm run db:studio`

### Development server

First, copy the file `.env.example` and rename it to `.env`
Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
