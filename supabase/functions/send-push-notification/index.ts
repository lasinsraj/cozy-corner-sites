import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingNotification {
  booking_id: string;
  guest_name: string;
  guest_phone: string;
  room_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingNotification = await req.json();
    
    console.log('Sending push notification for booking:', booking.booking_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all device tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('device_tokens')
      .select('token, device_type');

    if (tokensError) {
      console.error('Error fetching tokens:', tokensError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch device tokens' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!tokens || tokens.length === 0) {
      console.log('No device tokens registered');
      return new Response(
        JSON.stringify({ success: true, message: 'No devices to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!fcmServerKey) {
      console.log('FCM_SERVER_KEY not configured - skipping push notifications');
      return new Response(
        JSON.stringify({ success: false, message: 'FCM not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare notification payload
    const notificationPayload = {
      notification: {
        title: '🏨 New Booking!',
        body: `${booking.guest_name} booked ${booking.room_name} (${booking.check_in} - ${booking.check_out}) - $${booking.total_price}`,
        sound: 'default',
        badge: '1'
      },
      data: {
        booking_id: booking.booking_id,
        type: 'new_booking',
        click_action: 'OPEN_ADMIN'
      }
    };

    // Send to all registered devices
    const sendPromises = tokens.map(async ({ token }) => {
      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${fcmServerKey}`
          },
          body: JSON.stringify({
            to: token,
            ...notificationPayload
          })
        });

        const result = await response.json();
        console.log(`FCM response for token ${token.substring(0, 20)}...:`, result);
        
        // If token is invalid, remove it
        if (result.failure === 1 && result.results?.[0]?.error === 'NotRegistered') {
          console.log('Removing invalid token');
          await supabase.from('device_tokens').delete().eq('token', token);
        }
        
        return { success: true, token };
      } catch (error) {
        console.error(`Error sending to token ${token.substring(0, 20)}...:`, error);
        return { success: false, token, error };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;
    
    console.log(`Push notifications sent: ${successCount}/${tokens.length} successful`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        total: tokens.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing push notification:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
