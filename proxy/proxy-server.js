import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/google-proxy', async (req, res) => {
  const url = 'https://script.google.com/macros/s/AKfycbxRMuHYRZEucasmnhlbqQXvGyepb5Y-7kvoykFoCCxUqWQX8qYxGG_mcsHtOr3AzaO4TA/exec';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.text();
  res.status(response.status).send(data);
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
