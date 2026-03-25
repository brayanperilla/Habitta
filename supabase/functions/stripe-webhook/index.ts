import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.16.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Helper para actualizar el usuario a premium e insertar notificación
async function upgradeUserToPremium(supabaseAdmin: ReturnType<typeof createClient>, idusuario: number) {
  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({ plan: 'premium', rol: 'premium' })
    .eq('idusuario', idusuario);

  if (updateError) {
    throw updateError;
  }

  console.log(`✅ Usuario ${idusuario} actualizado a premium.`);

  const { error: notifError } = await supabaseAdmin
    .from('notificaciones')
    .insert({
      idusuario: idusuario,
      titulo: "¡Bienvenido a Premium! 🚀",
      descripcion: "Tu pago ha sido procesado exitosamente. Ahora disfrutas de los beneficios del plan Premium en Habitta.",
      tipo: "cuenta",
      leido: false,
      fechaEnvio: new Date().toISOString()
    });

  if (notifError) {
    console.error("Error al crear notificación de Premium:", notifError);
  }
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const bodyText = await req.text();
    const event = await stripe.webhooks.constructEventAsync(bodyText, signature, webhookSecret);

    console.log(`📦 Evento recibido: ${event.type}`);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- CASO 1: Pago directo (sin trial) ---
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        console.warn("⚠️ checkout.session.completed sin client_reference_id.");
      } else {
        const idusuario = parseInt(userId);
        await upgradeUserToPremium(supabaseAdmin, idusuario);
      }
    }

    // --- CASO 2: Suscripción creada (con o sin trial) ---
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // El userId lo guardamos en los metadatos de la suscripción
      const userId = subscription.metadata?.habitta_user_id;

      if (!userId) {
        // Intentar obtenerlo desde el checkout session via customer
        const customerId = subscription.customer as string;
        console.warn(`⚠️ Suscripción sin metadata habitta_user_id. Customer: ${customerId}`);

        // Buscar la sesión de checkout que originó esta suscripción
        const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 5 });
        const matchSession = sessions.data.find(s => s.client_reference_id);
        
        if (matchSession?.client_reference_id) {
          const idusuario = parseInt(matchSession.client_reference_id);
          await upgradeUserToPremium(supabaseAdmin, idusuario);
        } else {
          console.error("❌ No se pudo identificar el usuario en la suscripción.");
        }
      } else {
        const idusuario = parseInt(userId);
        await upgradeUserToPremium(supabaseAdmin, idusuario);
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (err) {
    console.error(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`, { status: 400 });
  }
});
