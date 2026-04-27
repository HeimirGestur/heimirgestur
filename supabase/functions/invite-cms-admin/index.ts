import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "heimirgestur@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend credentials are not configured.");
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const siteUrl = req.headers.get("origin") ?? "https://heimirgestur.lovable.app";

    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(ADMIN_EMAIL, {
      redirectTo: `${siteUrl}/admin`,
    });

    let user = invited.user;

    if (inviteError || !user) {
      const { data: users, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) throw listError;

      user = users.users.find((candidate) => candidate.email?.toLowerCase() === ADMIN_EMAIL);
      if (!user) throw inviteError ?? new Error("Could not create or locate the admin user.");
    }

    const { error: profileError } = await admin
      .from("profiles")
      .upsert({ user_id: user.id, email: ADMIN_EMAIL }, { onConflict: "user_id" });

    if (profileError) throw profileError;

    const { error: roleError } = await admin
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({ ok: true, email: ADMIN_EMAIL, invited: !inviteError }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
