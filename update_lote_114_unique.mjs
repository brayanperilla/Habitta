import { createClient } from '@supabase/supabase-js';

const url = 'https://votkgvlsultmgnypgzis.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGtndmxzdWx0bWdueXBnemlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzExNDMsImV4cCI6MjA4NjQwNzE0M30.trZdF5g-mw0YhXrlXxfiAkLIub-9kte8cEXgmfaoELQ';
const supabase = createClient(url, key);

const EMAIL = 'perillab884@gmail.com';
const PASSWORD = 'semeolvido@';

async function updateLote114Unique() {
  console.log('Login para nueva imagen única del lote 114...');
  await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

  // Imagen ÚNICA de terreno (field / grass) verificada
  const uniqueUrl = "https://images.unsplash.com/photo-1433086466391-f7ad449fa973?w=800&q=80";
  
  console.log(`Asignando imagen única: ${uniqueUrl}`);

  // Actualizar propiedades y galería
  await supabase.from('propiedades').update({ fotoUrl: uniqueUrl }).eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').delete().eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').insert({ idpropiedad: 114, url: uniqueUrl, orden: 1 });

  console.log('--- LOTE 114 ACTUALIZADO CON IMAGEN ÚNICA ---');
}

updateLote114Unique();
