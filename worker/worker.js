export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // Remove leading slash

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET: Serve the image
    if (request.method === "GET") {
      if (!key || key === "") {
         return new Response("Rajendranagar Image Worker Active", { status: 200, headers: corsHeaders });
      }

      const object = await env.R2_BUCKET.get(key);
      if (!object) {
        return new Response("Image Not Found", { status: 404, headers: corsHeaders });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
      headers.set("Access-Control-Allow-Origin", "*");
      
      return new Response(object.body, { headers });
    }

    // PUT: Upload the image
    if (request.method === "PUT") {
      try {
        if (!env.R2_BUCKET) {
          throw new Error("R2_BUCKET binding not found. Check wrangler.toml");
        }

        const filename = crypto.randomUUID() + ".webp";
        
        // Save to R2 Bucket
        await env.R2_BUCKET.put(filename, request.body, {
          httpMetadata: {
            contentType: "image/webp",
          },
        });

        // The Worker URL itself is now the image URL
        const publicUrl = `${url.origin}/${filename}`;

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  },
};