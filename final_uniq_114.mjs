import { createClient } from '@supabase/supabase-js';

const url = 'https://votkgvlsultmgnypgzis.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGtndmxzdWx0bWdueXBnemlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzExNDMsImV4cCI6MjA4NjQwNzE0M30.trZdF5g-mw0YhXrlXxfiAkLIub-9kte8cEXgmfaoELQ';
const supabase = createClient(url, key);

const EMAIL = 'perillab884@gmail.com';
const PASSWORD = 'semeolvido@';

async function finalUniq114() {
  console.log('Login para arreglo TOTAL del lote 114...');
  await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

  // Usar LoremFlickr (extremadamente estable) con temática de terreno/campo
  const fallbackStableUrl = "https://loremflickr.com/800/600/land,field,empty-land?lock=114";
  
  console.log(`Aplicando imagen de respaldo estable: ${fallbackStableUrl}`);

  // Actualizar propiedades y galería
  await supabase.from('propiedades').update({ fotoUrl: fallbackStableUrl }).eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').delete().eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').insert({ idpropiedad: 114, url: fallbackStableUrl, orden: 1 });

  console.log('--- LOTE 114 REPARADO CON IMAGEN DE RESPALDO ---');
}

finalUniq114();
