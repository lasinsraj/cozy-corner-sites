import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: BookingNotification = await req.json();
    
    console.log("Received booking notification request:", body);

    const { guest_name, guest_phone, room_name, check_in, check_out, total_price, booking_id } = body;

    // Get owner's WhatsApp number from secrets
    const ownerPhone = Deno.env.get("OWNER_WHATSAPP_NUMBER");
    const callMeBotApiKey = Deno.env.get("CALLMEBOT_API_KEY");

    if (!ownerPhone) {
      console.log("OWNER_WHATSAPP_NUMBER not configured - skipping WhatsApp notification");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Booking recorded. WhatsApp notification skipped - OWNER_WHATSAPP_NUMBER not configured." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the message
    const message = `🏨 *New Booking at Casa Serena!*

👤 Guest: ${guest_name}
📞 Phone: ${guest_phone}
🛏️ Room: ${room_name}
📅 Check-in: ${check_in}
📅 Check-out: ${check_out}
💰 Total: $${total_price}
🔖 Ref: ${booking_id.slice(0, 8).toUpperCase()}

Please confirm this booking in your admin dashboard.`;

    console.log("Sending WhatsApp notification to:", ownerPhone);

    // Using CallMeBot API (free WhatsApp API service)
    // To set up: Send "I allow callmebot to send me messages" to +34 644 52 74 88 on WhatsApp
    // Then you'll receive your API key
    if (callMeBotApiKey) {
      const encodedMessage = encodeURIComponent(message);
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${ownerPhone}&text=${encodedMessage}&apikey=${callMeBotApiKey}`;

      const response = await fetch(callMeBotUrl);
      const responseText = await response.text();
      
      console.log("CallMeBot response:", responseText);

      if (!response.ok) {
        console.error("Failed to send WhatsApp notification:", responseText);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to send WhatsApp notification" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("WhatsApp notification sent successfully");
    } else {
      console.log("CALLMEBOT_API_KEY not configured - logging message instead");
      console.log("Would have sent message:", message);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing notification:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});