const https = require('https');

function fetchRandomBytes() {
  return new Promise((resolve, reject) => {
    https.get('https://www.random.org/cgi-bin/randbyte?nbytes=32&format=h', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Usage example:
fetchRandomBytes()
  .then((bytes) => {
    console.log('Random bytes:', bytes);
  })
  .catch((err) => {
    console.error('Error fetching random bytes:', err);
  });