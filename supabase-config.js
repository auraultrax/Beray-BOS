window.BERAY_CONFIG = {
  supabaseUrl: "https://zblbsjmtituericpmazj.supabase.co",
  // Public publishable key only. Never place a service_role/secret key in browser code.
  supabaseKey: "sb_publishable_0XUjb6u_goYIjSB6m7vYsQ_hpyI0Az7"
};
window.beraySupabase = window.supabase.createClient(
  window.BERAY_CONFIG.supabaseUrl,
  window.BERAY_CONFIG.supabaseKey,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);