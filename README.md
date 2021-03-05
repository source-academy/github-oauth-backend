# github-oauth-backend

A simple OAuth authorisation code flow proxy for the Source Academy&mdash;GitHub integration.

The server receives the authorisation code from the frontend, which it exchanges with GitHub for an access token. The access token is then returned to the frontend.

## Node modules used

- Express
- ESM
- dotenv
- node-fetch
