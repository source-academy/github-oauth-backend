# github-oauth-backend

A simple OAuth authorisation code flow proxy for the Source Academy&mdash;GitHub integration.

The server receives the access code from the frontend, which it exchanges with GitHub for an auth token. The auth token is then returned to the frontend.

## Node modules used

- Express
- ESM
- dotenv
- node-fetch
