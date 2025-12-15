import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remainingRequests: number }> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `${config.keyPrefix}:${userId}`;

  // Get rate limit data from database
  const { data: rateLimitData, error: fetchError } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('key', key)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Rate limit fetch error:', fetchError);
    return { allowed: true, remainingRequests: config.maxRequests }; // Fail open
  }

  // Clean up old requests
  const requests = rateLimitData?.requests || [];
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);

  if (recentRequests.length >= config.maxRequests) {
    return { allowed: false, remainingRequests: 0 };
  }

  // Add current request
  recentRequests.push(now);

  // Update rate limit data
  const { error: upsertError } = await supabase
    .from('rate_limits')
    .upsert({
      key,
      requests: recentRequests,
      updated_at: new Date().toISOString()
    });

  if (upsertError) {
    console.error('Rate limit upsert error:', upsertError);
  }

  return {
    allowed: true,
    remainingRequests: config.maxRequests - recentRequests.length
  };
}

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  songGeneration: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'song_gen'
  },
  artworkGeneration: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'artwork_gen'
  },
  creditPurchase: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'credit_purchase'
  }
};