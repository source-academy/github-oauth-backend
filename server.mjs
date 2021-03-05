import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH || path.join(__dirname, 'config.json'), 'utf8'));

// Create application
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up the port
const PORT = process.env.port || 9000;
app.listen(PORT, () => console.log('Listening http://localhost:' + PORT));

app.use(cors({
    methods: ['POST'],
    origin: config.corsOrigin
}));

// Passes the code on to GitHub, then returns the access token
app.post('/get_access_token', async (req, res) => {
    const clientSecret = config.clientSecrets[req.body.clientId];
    const code = req.body.code;

    if (!code || !clientSecret) {
        res.status(400).end();
        return;
    }

    const access_token = await getAccessToken(code, req.body.clientId, clientSecret);
    if (!access_token) {
        res.status(400).end();
        return;
    }

    res.end(JSON.stringify({ access_token }));
});

// Exchanges the code with GitHub to receive the Access Token
async function getAccessToken(code, clientId, clientSecret) {
    const request = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
        })
    });

    const data = await request.text();
    const params = new URLSearchParams(data);
    return params.get('access_token');
}
