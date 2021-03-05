import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

// Import environment variables
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const corsOrigins = process.env.CORS_ORIGINS_JSON ? JSON.parse(process.env.CORS_ORIGINS_JSON) : false;

// Create application
const app = express();

// Create parser
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up the port
const PORT = process.env.port || 9000;
app.listen(PORT, () => console.log('Listening http://localhost:' + PORT));

app.use(cors({
    methods: ['POST'],
    origin: corsOrigins
}));

// Passes the code on to GitHub, then returns the access token
app.post('/get_access_token', async (req, res) => {
    const code = req.body.code;
    if (!code) {
        res.status(400).end();
        return;
    }

    const access_token = await getAccessToken(code);
    if (!access_token) {
        res.status(400).end();
        return;
    }

    res.end(JSON.stringify({ access_token }));
});

// Exchanges the code with GitHub to receive the Access Token
async function getAccessToken(code) {
    const request = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clientID,
            clientSecret,
            code
        })
    });

    const data = await request.text();
    const params = new URLSearchParams(data);
    return params.get('access_token');
}
