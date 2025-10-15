import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  menuItemId: number;
  menuItemNumber: string | number;
  name: string;
  quantity: number;
  basePrice: number;
  selectedSize?: { name: string; description?: string; price: number } | null;
  selectedIngredients?: string[] | null;
  selectedExtras?: string[] | null;
  selectedPastaType?: string | null;
  selectedSauce?: string | null;
  selectedExclusions?: string[] | null;
  selectedSideDish?: string | null;
  totalPrice: number;
}

interface OrderData {
  orderType: string;
  deliveryZone?: string;
  deliveryTime: string;
  specificTime?: string;
  name: string;
  phone: string;
  street?: string;
  houseNumber?: string;
  postcode?: string;
  note?: string;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RESTAURANT_EMAIL = Deno.env.get("RESTAURANT_EMAIL") || "orders@restaurant.com";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const orderData: OrderData = await req.json();

    let emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ea580c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; color: #ea580c; margin-bottom: 10px; font-size: 16px; }
            .order-item { background-color: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 3px solid #ea580c; }
            .total-section { background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; color: #ea580c; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .info-row { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <h1>Neue Bestellung</h1>
            </div>
            <div class=\"content\">
              <div class=\"section\">
                <div class=\"section-title\">Kundeninformationen</div>
                <div class=\"info-row\"><strong>Name:</strong> ${orderData.name}</div>
                <div class=\"info-row\"><strong>Telefon:</strong> ${orderData.phone}</div>
                <div class=\"info-row\"><strong>Bestellart:</strong> ${orderData.orderType === 'pickup' ? 'Abholung' : 'Lieferung'}</div>
                ${orderData.orderType === 'delivery' && orderData.street ? `
                  <div class=\"info-row\"><strong>Adresse:</strong> ${orderData.street} ${orderData.houseNumber}, ${orderData.postcode}</div>
                  ${orderData.deliveryZone ? `<div class=\"info-row\"><strong>Gebiet:</strong> ${orderData.deliveryZone}</div>` : ''}
                ` : ''}
                <div class=\"info-row\"><strong>Zeit:</strong> ${orderData.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${orderData.specificTime} Uhr`}</div>
              </div>

              <div class=\"section\">
                <div class=\"section-title\">Bestellung</div>
                ${orderData.orderItems.map(item => {
                  let itemDetails = [];
                  if (item.selectedSize) {
                    itemDetails.push(`Größe: ${item.selectedSize.name}${item.selectedSize.description ? ` - ${item.selectedSize.description}` : ''}`);
                  }
                  if (item.selectedPastaType) itemDetails.push(`Pasta: ${item.selectedPastaType}`);
                  if (item.selectedSauce) itemDetails.push(`Soße: ${item.selectedSauce}`);
                  if (item.selectedExclusions && item.selectedExclusions.length > 0) {
                    itemDetails.push(`Salat: ${item.selectedExclusions.join(', ')}`);
                  }
                  if (item.selectedSideDish) itemDetails.push(`Beilage: ${item.selectedSideDish}`);
                  if (item.selectedIngredients && item.selectedIngredients.length > 0) {
                    itemDetails.push(`Zutaten: ${item.selectedIngredients.join(', ')}`);
                  }
                  if (item.selectedExtras && item.selectedExtras.length > 0) {
                    itemDetails.push(`Extras: ${item.selectedExtras.join(', ')}`);
                  }

                  return `
                    <div class=\"order-item\">
                      <div style=\"font-weight: bold; margin-bottom: 5px;\">
                        ${item.quantity}x Nr. ${item.menuItemNumber} ${item.name}
                      </div>
                      ${itemDetails.length > 0 ? `<div style=\"font-size: 14px; color: #666;\">${itemDetails.join(' • ')}</div>` : ''}
                      <div style=\"text-align: right; margin-top: 5px; font-weight: bold;\">
                        ${item.totalPrice.toFixed(2).replace('.', ',')} €
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <div class=\"total-section\">
                <div class=\"total-row\">
                  <span>Zwischensumme:</span>
                  <span>${orderData.subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                ${orderData.deliveryFee > 0 ? `
                  <div class=\"total-row\">
                    <span>Liefergebühr:</span>
                    <span>${orderData.deliveryFee.toFixed(2).replace('.', ',')} €</span>
                  </div>
                ` : ''}
                <div class=\"total-row grand-total\">
                  <span>Gesamtbetrag:</span>
                  <span>${orderData.total.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              ${orderData.note ? `
                <div class=\"section\">
                  <div class=\"section-title\">Anmerkung</div>
                  <div style=\"background-color: white; padding: 15px; border-radius: 5px;\">
                    ${orderData.note}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Restaurant Orders <onboarding@resend.dev>",
        to: [RESTAURANT_EMAIL],
        subject: `Neue Bestellung von ${orderData.name}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});