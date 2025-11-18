import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const services = await sql`
      SELECT 
        id,
        name,
        description,
        short_description,
        price_range,
        features,
        image_url,
        icon_name,
        order_position,
        is_active,
        created_at,
        updated_at
      FROM services
      WHERE is_active = true
      ORDER BY order_position ASC, created_at ASC
    `;

    // Parse JSON features if they exist
    const servicesWithFeatures = services.map((service) => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
    }));

    return Response.json(servicesWithFeatures);
  } catch (error) {
    console.error("Get public services API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
