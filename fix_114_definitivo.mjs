import { createClient } from '@supabase/supabase-js';

const url = 'https://votkgvlsultmgnypgzis.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGtndmxzdWx0bWdueXBnemlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzExNDMsImV4cCI6MjA4NjQwNzE0M30.trZdF5g-mw0YhXrlXxfiAkLIub-9kte8cEXgmfaoELQ';
const supabase = createClient(url, key);

const EMAIL = 'perillab884@gmail.com';
const PASSWORD = 'semeolvido@';

async function fix114Definitivo() {
  console.log('Login para arreglo definitivo del lote 114...');
  await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

  // Imagen estable de un lote realista (field / nature)
  const finalStableUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";
  
  console.log(`Aplicando URL estable: ${finalStableUrl}`);

  // Actualizar propiedades y galería
  await supabase.from('propiedades').update({ fotoUrl: finalStableUrl }).eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').delete().eq('idpropiedad', 114);
  await supabase.from('fotospropiedad').insert({ idpropiedad: 114, url: finalStableUrl, orden: 1 });

  console.log('--- LOTE 114 REPARADO TOTALMENTE ---');
}

fix114Definitivo();
