import express from 'express';
import fetch from 'node-fetch';

// Import environment variables
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const frontendAddress = process.env.FRONT_END_ADDRESS;

// Create application
const app = express();

// Create parser
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up the port
const PORT = process.env.port || 9000;
app.listen(PORT, () => console.log('Listening http://localhost:' + PORT));



// Passes the code on to GitHub, then returns the access token
app.post('/get_access_token', (req, res) => {
    const code = req.body.code;

    getAccessToken(code)
    .then(accessToken => {
        res.setHeader('Access-Control-Allow-Origin', frontendAddress);
        res.end(JSON.stringify({ access_token: accessToken }));
    });
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
