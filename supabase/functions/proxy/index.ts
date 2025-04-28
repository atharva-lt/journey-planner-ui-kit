
// Follow Deno's ES modules convention
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers to allow requests from your Lovable domain
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Consider restricting this to your specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log("Proxy function called:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const targetEndpoint = url.searchParams.get('endpoint') || '';
    
    // Get the base Langflow API URL from the request or use the default
    // The API URL should come from the frontend to make this proxy flexible
    const apiBaseUrl = 'https://api.langflow.astra.datastax.com/lf/fe006637-75ba-4934-a97e-eaa0753cc574/api/v1/run/356caed8-e536-47f0-8046-XXXX';
    
    if (!targetEndpoint && !apiBaseUrl) {
      throw new Error('No target endpoint or API URL specified');
    }

    // Construct the target URL
    const targetUrl = targetEndpoint ? `${apiBaseUrl}/${targetEndpoint}` : apiBaseUrl;
    console.log(`Proxying request to: ${targetUrl}`);

    // Get the request body if present
    let body = null;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
      console.log('Request body:', body);
    }

    // Copy headers from the original request, excluding host-specific headers
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      // Skip host-specific headers
      if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
        headers.append(key, value);
      }
    });
    
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    });

    // Get the response data
    let responseData;
    const responseContentType = response.headers.get('content-type') || '';
    
    if (responseContentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Add CORS headers to the response
    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Content-Type', responseContentType);

    return new Response(
      typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
      {
        status: response.status,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error('Proxy error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
