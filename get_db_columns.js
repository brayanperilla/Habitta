import { supabase } from "./src/infrastructure/supabase/client.js";

async function getCols() {
  const { data, error } = await supabase.from("usuarios").select().limit(1);
  if (error) {
    console.error("Error fetching data:", error);
  } else if (data && data.length > 0) {
    console.log("Columnas actuales en la BD:");
    console.log(Object.keys(data[0]));
  } else {
    console.log("No hay usuarios en la tabla, imposible inferir schema por REST.");
  }
  process.exit(0);
}

getCols();
