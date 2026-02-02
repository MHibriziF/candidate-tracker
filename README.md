# Candidate Tracker

A web app to track and monitor progress of recruitment candidates.

Deployment : https://candidate-tracker.mhibrizif.site
Deepwiki: https://deepwiki.com/MHibriziF/candidate-tracker

## How to run locally

Prerequisites:

- node.js & npm

- PostgreSQL server or Docker

### Cloning repository

Clone this repository by running `git clone https://github.com/MHibriziF/candidate-tracker.git` in your desired directory.

Navigate to project by running `cd candidate-tracker`

### Running docker

If you have your own PostgreSQL server setup, you could skip this step and fill the `DATABASE_URL` for the `.env` file to your corresponding server.

If you are using docker to run PostgreSQL server locally, in the root of this project directory run `docker-compose up -d`. The PostgreSQL server should run shortly after

After running the database, make sure to fill `.env` using the value in `.env.example`.

### Running the web app

1. Install dependencies by running `npm i`
2. Run the server by running `npm run dev`
3. Check health and connection with database by running this api route `/api/health`
