const https = require('https');

async function fetchRandomBytes() {
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
async function getRandomBytes() {
  const response = await fetchRandomBytes();
  console.log(response);
}

// getRandomBytes();
export default getRandomBytes;
