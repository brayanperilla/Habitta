import { createClient } from '@supabase/supabase-js';

const url = 'https://votkgvlsultmgnypgzis.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGtndmxzdWx0bWdueXBnemlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzExNDMsImV4cCI6MjA4NjQwNzE0M30.trZdF5g-mw0YhXrlXxfiAkLIub-9kte8cEXgmfaoELQ';
const supabase = createClient(url, key);

const EMAIL = 'perillab884@gmail.com';
const PASSWORD = 'semeolvido@';

async function cleanup116() {
  console.log('Login para limpieza manual de #116...');
  await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

  const id = 116;

  // Obtener fotos actuales
  const { data: currentPhotos } = await supabase.from('fotospropiedad').select('url, idfotopropiedad').eq('idpropiedad', id).order('orden', { ascending: true });
  
  if (!currentPhotos || currentPhotos.length === 0) {
      console.log('No hay fotos para limpiar.');
      return;
  }

  console.log(`Encontradas ${currentPhotos.length} fotos.`);

  // Si hay repetidas o el usuario quiere limpiar, podemos dejar las primeras 3 que son las mínimas
  // Pero como no sé cuáles quiere borrar exactamente, voy a eliminar las duplicadas si las hay
  const seenUrls = new Set();
  const toDelete = [];

  for (const f of currentPhotos) {
      if (seenUrls.has(f.url)) {
          toDelete.push(f.idfotopropiedad);
      } else {
          seenUrls.add(f.url);
      }
  }

  if (toDelete.length > 0) {
      console.log(`Borrando ${toDelete.length} fotos duplicadas...`);
      await supabase.from('fotospropiedad').delete().in('idfotopropiedad', toDelete);
  }

  console.log('--- LIMPIEZA COMPLETADA ---');
}

cleanup116();
