# github-oauth-backend
A standalone server that is meant to provide a microservice for GitHub integration of the Source Academy front-end.

The server receives the access code from the front-end, which it exchanges with GitHub for an access token. The access token is then returned to the front-end.

## Node Modules used
- Express
- ESM
- dotenv
- node-fetch
