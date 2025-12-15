
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    const { packageType, mode = 'payment' } = await req.json();
    
    // Define credit packages with updated pricing
    const packages = {
      starter: { credits: 3, price: 799, name: "Starter Pack" }, // $7.99
      popular: { credits: 8, price: 1499, name: "Road Warrior" }, // $14.99
      premium: { credits: 20, price: 2999, name: "Ultimate Pack" }, // $29.99
    };

    const selectedPackage = packages[packageType as keyof typeof packages];
    if (!selectedPackage) {
      throw new Error("Invalid package type");
    }

    // Check if Stripe secret key is available
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

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPackage.name,
              description: `${selectedPackage.credits} song generation credits`
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      metadata: {
        user_id: user.id,
        credits: selectedPackage.credits.toString(),
        packageType: packageType // Changed from package_type to packageType
      }
    };

    // Enable Apple Pay and Google Pay on mobile
    const userAgent = req.headers.get("user-agent") || "";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    
    if (isMobile) {
      sessionConfig.payment_method_types.push("apple_pay", "google_pay");
    }

    // Configure for embedded mode or redirect mode
    if (mode === 'embedded') {
      sessionConfig.ui_mode = 'embedded';
      sessionConfig.return_url = `${req.headers.get("origin")}/settings?purchase=success`;
    } else {
      sessionConfig.success_url = `${req.headers.get("origin")}/settings?purchase=success`;
      sessionConfig.cancel_url = `${req.headers.get("origin")}/settings?purchase=cancelled`;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Return appropriate response based on mode
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
