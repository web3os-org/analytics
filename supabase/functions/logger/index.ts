/* global Deno */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { v4 } from 'https://deno.land/std@0.131.0/uuid/mod.ts'

const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(
        'ok',
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Expose-Headers": "Content-Length, X-JSON",
                "Access-Control-Allow-Headers": "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
            }
        }
    )
  }

  const { details, event, user } = await req.json()
  supabase.from('logs').insert([{ event, user, details }]).then((data: any) => console.log(data))

  return new Response(
    JSON.stringify({}),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Expose-Headers": "Content-Length, X-JSON",
        "Access-Control-Allow-Headers": "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
      }
    },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
