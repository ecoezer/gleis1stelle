import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const LOCKOUT_DURATIONS = [
  5 * 60 * 1000,      // 5 minutes
  15 * 60 * 1000,     // 15 minutes
  60 * 60 * 1000,     // 1 hour
  12 * 60 * 60 * 1000 // 12 hours
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get admin auth record
    const { data: authData, error: fetchError } = await supabase
      .from('admin_auth')
      .select('*')
      .limit(1)
      .single();

    if (fetchError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const now = new Date();

    // Check if account is locked
    if (authData.locked_until) {
      const lockedUntil = new Date(authData.locked_until);
      if (now < lockedUntil) {
        const remainingMs = lockedUntil.getTime() - now.getTime();
        const remainingMin = Math.ceil(remainingMs / 60000);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Account locked. Try again in ${remainingMin} minute(s)`,
            locked: true,
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Set default password on first use
    const correctPassword = 'admin123';
    
    // Verify password
    if (password === correctPassword) {
      // Successful login - reset failed attempts
      await supabase
        .from('admin_auth')
        .update({
          failed_attempts: 0,
          locked_until: null,
          last_attempt_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', authData.id);

      // Generate a simple session token
      const token = btoa(`${authData.id}:${now.getTime()}`);

      return new Response(
        JSON.stringify({ success: true, token }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Failed login - increment attempts
      const newFailedAttempts = authData.failed_attempts + 1;
      let lockedUntil = null;

      // Determine lockout duration based on failed attempts
      if (newFailedAttempts >= 3) {
        const lockoutIndex = Math.min(newFailedAttempts - 3, LOCKOUT_DURATIONS.length - 1);
        const lockoutDuration = LOCKOUT_DURATIONS[lockoutIndex];
        lockedUntil = new Date(now.getTime() + lockoutDuration).toISOString();
      }

      await supabase
        .from('admin_auth')
        .update({
          failed_attempts: newFailedAttempts,
          locked_until: lockedUntil,
          last_attempt_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', authData.id);

      const attemptsRemaining = Math.max(0, 3 - newFailedAttempts);
      const message = attemptsRemaining > 0
        ? `Incorrect password. ${attemptsRemaining} attempt(s) remaining`
        : 'Account locked due to multiple failed attempts';

      return new Response(
        JSON.stringify({
          success: false,
          error: message,
          locked: lockedUntil !== null,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});