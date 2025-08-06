import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No stripe signature found');
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('No webhook secret configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    console.log('Webhook event:', event.type);

    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Processing completed checkout session:', session.id);

      // Get customer email to find user
      const customerEmail = session.customer_details?.email || session.customer_email;
      if (!customerEmail) {
        console.error('No customer email found in session');
        return new Response('No customer email', { status: 400 });
      }

      // Get package info from metadata
      const packageType = session.metadata?.packageType;
      if (!packageType) {
        console.error('No package type in metadata');
        return new Response('No package type', { status: 400 });
      }

      // Determine credits based on package
      const packages = {
        starter: { credits: 3, price: 5.99 },
        popular: { credits: 5, price: 9.99 },
        premium: { credits: 10, price: 19.99 },
      };

      const packageInfo = packages[packageType as keyof typeof packages];
      if (!packageInfo) {
        console.error('Invalid package type:', packageType);
        return new Response('Invalid package type', { status: 400 });
      }

      // Use service role to update database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      // Find user by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', customerEmail)
        .single();

      if (userError) {
        console.error('Error finding user:', userError);
        return new Response('User not found', { status: 400 });
      }

      const userId = users.user_id;
      console.log('Found user:', userId);

      // Get current credits
      const { data: currentCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (creditsError) {
        console.error('Error getting current credits:', creditsError);
        return new Response('Error getting credits', { status: 500 });
      }

      // Update credits
      const newAvailableCredits = currentCredits.available_credits + packageInfo.credits;
      const newTotalPurchased = currentCredits.total_purchased + packageInfo.credits;

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          available_credits: newAvailableCredits,
          total_purchased: newTotalPurchased,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return new Response('Error updating credits', { status: 500 });
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: 'purchase',
          amount: packageInfo.credits,
          description: `Purchased ${packageInfo.credits} credits (${packageType} pack)`,
          stripe_session_id: session.id,
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        return new Response('Error creating transaction', { status: 500 });
      }

      console.log(`Successfully added ${packageInfo.credits} credits to user ${userId}`);
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
});