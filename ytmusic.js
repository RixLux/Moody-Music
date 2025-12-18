// app.js
const express = require('express');
const YTMusic = require('ytmusic-api');

const app = express();
const port = 3000;

const ytmusic = new YTMusic();

(async () => {
  await ytmusic.initialize();
  console.log('YTMusic initialized');
})();

app.use(express.urlencoded({ extended: true }));

// Home
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Hybrid YT Music</title>
        <style>
          body { font-family: sans-serif; padding: 40px; }
          input { padding: 8px; width: 260px; }
          button { padding: 8px 12px; }
          li { margin-bottom: 16px; }
          a.play { text-decoration: none; color: white; background: #e11; padding: 6px 10px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>🎵 Hybrid YT Music Search</h1>

        <form method="GET" action="/search">
          <input name="q" placeholder="Search song or artist" />
          <button type="submit">Search</button>
        </form>
      </body>
    </html>
  `);
});

// Search
app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.redirect('/');

  try {
    const results = await ytmusic.search(query, 'song');

    const list = results.slice(0, 5).map(song => {
      const videoId = song.videoId;
      const ytMusicUrl = `https://music.youtube.com/watch?v=${videoId}`;

      return `
        <li>
          <strong>${song.name}</strong><br />
          ${song.artist?.name || 'Unknown Artist'}<br /><br />
          <iframe
  width="300"
  height="80"
  src="https://www.youtube.com/embed/${videoId}"
  frameborder="0"
  allow="autoplay">
</iframe>

        </li>
      `;
    }).join('');

    res.send(`
      <html>
        <body>
          <h2>Results for: "${query}"</h2>
          <ul>${list}</ul>
          <br />
          <a href="/">← Back</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send('Error fetching data from YouTube Music');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

