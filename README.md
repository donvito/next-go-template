# Next.js with Go runtime as backend

This is a [Next.js](https://nextjs.org) project which uses the [Go runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/go) of Vercel as the backend.

The frontend retrieves data from the backend using the `/api/todos` endpoint. The Go backend uses a PostgreSQL database.

## Go backend

`/api/todos.go`

To access the Go backend, access [/api/todos]('/api/todos')

## You need a PostgreSQL database for this to work

You can create a new one in Railway: [https://railway.com/](https://railway.com/) or any postgres cloud hosting service.

## Configure environment variables

You can configure environment variables in the `.env` file. Postgres environment variables are required to connect to the database.

```bash
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## Create todos table

To create the todos table in your PostgreSQL database, run the following SQL command:

```sql
create table public.todos
(
    id         serial
        primary key,
    todo       text,
    title      text,
    completed  boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

alter table public.todos
    owner to postgres;
```

## Running the development server with the Go backend  

```bash
vercel dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.