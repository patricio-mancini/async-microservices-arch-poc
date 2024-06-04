# Asynchronous Microservices Architecture

This proof of concept showcases a small microservices architecture that implements `Node.js`, `GraphQL`, and `Kafka` as message broker between services. `Mongodb` is used as a persistance layer.

## Requeriments

- Ensure you are using `Node.js` version 18 or later.
- `Docker Desktop` with `Docker CLI`: Required for containerization and running the application locally.

## Getting Started

- Install dependencies by running `npm install` at the root of the monorepo project.

## Scripts

### `npm run test:unit`

Launches the test runner for all the workspaces in the monorepo that have a test suite. Test coverage information will be displayed in the console, and an LCOV coverage report will be generated at the root of each workspace.

### `npm run docker:up`

Builds `Docker` images and starts containers for all the microservices using `Docker Compose`, enabling end-to-end testing in development mode.

### `npm run docker:down`

Stops the running containers that were started by the `docker:up` command.

## Architecture Details

To support this application, it has been adopted a monorepo structure using `npm workspaces`. This monorepo contains three distinct microservices, all powered by `Node.js`:

### `api-gateway`

The `api-gateway` microservice serves as the central entry point for all client requests in the application. It exposes a `GraphQL` API that allows clients to perform various actions, using `Kafka` to send messages and listen for responses processed by the appropriate microservice.

The GraphQL implementation supports the following API:

- Queries
  1. `getPlayers`
     - Retrieves player information based on the `leagueCode` and optionally the `teamName`.
     - Parameters:
       - `leagueCode`: String (required)
       - `teamName`: String (optional)
   2. `getTeam`
      -  Retrieves team information, including the coach and optionally the players.
      -  Parameters:
         -  `teamName`: String (required)
         -  `resolvePlayers`: Boolean (optional)
-  Mutations
   1. `importLeague`
      -  Initiates the import of league data based on the `leagueCode`.
      -  Parameters:
         -  `leagueCode`: String (required)

### `database-service`

This microservice handles the storage and retrieval of data for the application. It interacts with a `MongoDB` to manage and persist data related to `competitions`, `teams`, `players`, and `coaches`. This service is responsible for normalizing and storing new data and providing it for other microservices to process and respond to client requests.

The `database-service` performs the following actions:

- Connects to the `MongoDB` database.
- Sets up `Kafka` consumers to listen for incoming messages related to league data import and queries.
- Processes and stores league data received from the `league-importer` microservice.
- Handles queries for retrieving `team` and `player` information, ensuring data is accurately fetched from the database.

### `league-importer`

This microservice is responsible for fetching and processing league data from the `api.football-data.org` APIs. It gathers information about `competitions`, `teams`, `players`, and `coaches`, processes this data into a standardized format, and sends it to the `database-service` for storage via `Kafka`.

The `league-importer` performs the following actions:

- Listens to `Kafka` for league import requests.
- Fetches league data from the `api.football-data.org` APIs.
- Processes the fetched data into a standardized format.
- Publishes the processed league data to `Kafka` for the `database-service` to store.
- This service ensures that the latest league data is imported and made available for other microservices to access and use in responding to client requests.
