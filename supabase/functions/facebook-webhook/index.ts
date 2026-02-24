// deno-lint-ignore-file no-explicit-any

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const VERIFY_TOKEN = Deno.env.get("FACEBOOK_VERIFY_TOKEN");

  // GET - Facebook webhook verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    console.log("Verification request received:", { mode, challenge });

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      return new Response(challenge!, { status: 200, headers: corsHeaders });
    }

    return new Response("Forbidden", { status: 403, headers: corsHeaders });
  }

  // POST - Facebook webhook event → forward to Boltic
  if (req.method === "POST") {
    const body = await req.text();
    console.log("Event received, forwarding to Boltic");

    try {
      const bolticRes = await fetch(
        "https://asia-south1.api.boltic.io/service/webhook/temporal/v1.0/3aed43ee-2b86-4a72-bbe3-5dc8db588d82/workflows/execute/d67bc659-4e70-42c1-bd9c-3de69ce40e8e",
        { method: "POST", headers: { "Content-Type": "application/json" }, body }
      );
      const bolticText = await bolticRes.text();
      console.log("Boltic response:", bolticRes.status, bolticText);
    } catch (err) {
      console.error("Error forwarding to Boltic:", err);
    }

    return new Response(JSON.stringify({ status: "EVENT_RECEIVED" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});
