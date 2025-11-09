// Cliente Supabase para interactuar con la base de datos (PostgreSQL + API)
import { createClient } from "@supabase/supabase-js";

// Credenciales de acceso leídas desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Instancia exportada para realizar consultas (select, insert, update, delete)
export const supabase = createClient(supabaseUrl, supabaseKey);
