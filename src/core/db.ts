import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.DB_URL, process.env.DB_ANON_KEY)

export default supabase
