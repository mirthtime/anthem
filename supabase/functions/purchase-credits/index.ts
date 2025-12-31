import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders } from '../_shared/cors.ts';
import { validateCreditPurchaseRequest } from '../_shared/validation.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    const requestData = await req.json();
    
    const validation = validateCreditPurchaseRequest(requestData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.errors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const packageType = requestData.packageType;
    const mode = requestData.mode || 'payment';
    
    // Define credit packages with Stripe Price IDs
    const packages: Record<string, { credits: number; priceId: string; name: string; description: string }> = {
      starter: { 
        credits: 3, 
        priceId: "price_1SkQCGKLhNTZopXG1BcfuFCG",
        name: "Anthem Starter Pack",
        description: "3 AI song credits for your road trip memories"
      },
      popular: { 
        credits: 8, 
        priceId: "price_1SkQCGKLhNTZopXGuIwApSqT",
        name: "Anthem Road Warrior Pack",
        description: "8 AI song credits - Best value for most trips"
      },
      premium: { 
        credits: 20, 
        priceId: "price_1SkQCHKLhNTZopXGs4K2nKp6",
        name: "Anthem Ultimate Pack",
        description: "20 AI song credits - Maximum savings"
      },
    };

    const selectedPackage = packages[packageType];
    if (!selectedPackage) {
      throw new Error("Invalid package type");
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ 
        error: "Stripe not configured",
        message: "Please add your Stripe Secret Key to continue with payments"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") || "https://anthem.fm";
    
    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: selectedPackage.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        user_id: user.id,
        credits: selectedPackage.credits.toString(),
        packageType: packageType
      }
    };

    if (mode === 'embedded') {
      sessionConfig.ui_mode = 'embedded';
      sessionConfig.return_url = origin + "/settings?purchase=success";
    } else {
      sessionConfig.success_url = origin + "/settings?purchase=success";
      sessionConfig.cancel_url = origin + "/settings?purchase=cancelled";
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    if (mode === 'embedded') {
      return new Response(JSON.stringify({ 
        clientSecret: session.client_secret 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in purchase-credits:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
