const fs = require('fs');
const https = require('https');

// Leer variables de .env
const envRows = fs.readFileSync('.env', 'utf8').split('\n');
const env = {};
for (const row of envRows) {
  if (row.includes('=')) {
    const parts = row.split('=');
    env[parts[0].trim()] = parts[1].trim();
  }
}

const urlStr = env['VITE_SUPABASE_URL'] + '/rest/v1/usuarios?select=*&limit=1';
const url = new URL(urlStr);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname + url.search,
  method: 'GET',
  headers: {
    'apikey': env['VITE_SUPABASE_ANON_KEY'],
    'Authorization': 'Bearer ' + env['VITE_SUPABASE_ANON_KEY']
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.length > 0) {
        console.log('--- COLUMNAS ENCONTRADAS ---');
        console.log(Object.keys(json[0]).join(', '));
      } else {
        console.log('Sin resultados');
      }
    } catch(e) {
      console.log('Error parseando JSON:', e, data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
