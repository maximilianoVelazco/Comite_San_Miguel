const SUPABASE_URL = "https://ywhxglngxrzckdwhdfma.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qDSMQfWGaZ2yl67RNRCPkQ_0H0WiaBD";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);