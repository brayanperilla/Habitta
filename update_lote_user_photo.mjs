import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = 'https://votkgvlsultmgnypgzis.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdGtndmxzdWx0bWdueXBnemlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzExNDMsImV4cCI6MjA4NjQwNzE0M30.trZdF5g-mw0YhXrlXxfiAkLIub-9kte8cEXgmfaoELQ';
const supabase = createClient(url, key);

const EMAIL = 'perillab884@gmail.com';
const PASSWORD = 'semeolvido@';

async function updateLoteWithUserPhoto(id) {
  console.log(`Login para actualizar lote #${id} con la foto enviada...`);
  await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

  // 1. Usar la ruta de la imagen que acabo de guardar
  const localPhotoUrl = "/images/properties/lote_114_final.jpg";
  
  console.log(`Asignando nueva imagen local: ${localPhotoUrl}`);

  // 2. Actualizar fotoUrl principal
  await supabase.from('propiedades').update({ fotoUrl: localPhotoUrl }).eq('idpropiedad', id);

  // 3. Limpiar galería y poner solo esta
  await supabase.from('fotospropiedad').delete().eq('idpropiedad', id);
  await supabase.from('fotospropiedad').insert({ idpropiedad: id, url: localPhotoUrl, orden: 1 });

  console.log('--- LOTE 114 ACTUALIZADO CON TU FOTO ---');
}

updateLoteWithUserPhoto(114);
