import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    // Initialize Supabase client with service role key for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize client with anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { amount, description } = await req.json();
    
    if (!amount || amount <= 0) {
      throw new Error("Invalid credit amount");
    }

    // Get current balance using service role key
    const { data: currentBalance, error: balanceError } = await supabaseService
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (balanceError) {
      throw new Error("Could not fetch current balance");
    }

    if (currentBalance.available_credits < amount) {
      throw new Error("Insufficient credits");
    }

    // Update credit balance
    const { error: updateError } = await supabaseService
      .from('user_credits')
      .update({
        available_credits: currentBalance.available_credits - amount,
        total_used: currentBalance.total_used + amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      throw new Error("Failed to update credit balance");
    }

    // Record transaction
    const { error: transactionError } = await supabaseService
      .from('credit_transactions')
      .insert([{
        user_id: user.id,
        amount: -amount, // Negative for usage
        type: 'usage',
        description: description || 'Song generation',
        created_at: new Date().toISOString()
      }]);

    if (transactionError) {
      console.error('Failed to record transaction:', transactionError);
      // Don't fail the request for transaction logging failure
    }

    return new Response(JSON.stringify({ 
      success: true,
      remaining_credits: currentBalance.available_credits - amount 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in consume-credits:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});