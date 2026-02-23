import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const VERIFY_TOKEN = Deno.env.get("FACEBOOK_VERIFY_TOKEN");
  if (!VERIFY_TOKEN) {
    console.error("FACEBOOK_VERIFY_TOKEN is not configured");
    return new Response(
      JSON.stringify({ error: "Server misconfiguration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // GET - Facebook webhook verification
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      console.log("Webhook verification request:", { mode, token: token ? "***" : null, challenge });

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully!");
        return new Response(challenge, {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      } else {
        console.warn("Webhook verification failed - token mismatch or wrong mode");
        return new Response("Forbidden", {
          status: 403,
          headers: corsHeaders,
        });
      }
    }

    // POST - Facebook webhook event
    if (req.method === "POST") {
      const body = await req.json();
      console.log("Webhook event received:", JSON.stringify(body, null, 2));

      const object = body.object;

      if (object === "page") {
        // Process page events
        for (const entry of body.entry || []) {
          const pageId = entry.id;
          const time = entry.time;

          for (const event of entry.messaging || []) {
            const senderId = event.sender?.id;
            const message = event.message;

            if (message) {
              console.log(`Message from ${senderId} on page ${pageId}: ${message.text}`);
              // TODO: Add your message handling logic here
            }

            if (event.postback) {
              console.log(`Postback from ${senderId}: ${event.postback.payload}`);
              // TODO: Add your postback handling logic here
            }
          }

          // Handle feed/changes events  
          for (const change of entry.changes || []) {
            console.log(`Change on page ${pageId}:`, JSON.stringify(change));
            // TODO: Add your change handling logic here
          }
        }

        return new Response(JSON.stringify({ status: "EVENT_RECEIVED" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Not a page object
      return new Response(JSON.stringify({ error: "Unknown object type" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
