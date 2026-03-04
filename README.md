# expect(e2e)

expect(e2e) is a demo application for E2E testing.

⚠️ This project is a work in progress and intended for testing/demo use only.

## Setup

To run locally, set the following environment variables:

```bash
NEXTAUTH_SECRET=YOUR_SECRET
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

`NEXTAUTH_SECRET` and `NEXTAUTH_URL` can be set in the `.env.local` file and `DATABASE_URL` in the `.env` file.

Then install dependencies, sync the database schema and generate Prisma client code:

```bash
npm install
npx prisma db push
npx prisma generate
```
