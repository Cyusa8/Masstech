import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      ORDER BY order_position ASC, created_at ASC
    `;

    return Response.json(services);
  } catch (error) {
    console.error("Get services API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      short_description,
      price_range,
      features,
      image_url,
      icon_name,
      is_active,
    } = body;

    // Validate required fields
    if (!name || !short_description) {
      return Response.json(
        { error: "Name and short description are required" },
        { status: 400 },
      );
    }

    // Get the next order position
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(order_position), 0) as max_order
      FROM services
    `;
    const nextOrder = maxOrderResult[0].max_order + 1;

    const newService = await sql`
      INSERT INTO services (
        name,
        description,
        short_description,
        price_range,
        features,
        image_url,
        icon_name,
        order_position,
        is_active
      )
      VALUES (
        ${name},
        ${description || null},
        ${short_description},
        ${price_range || null},
        ${features ? JSON.stringify(features) : null},
        ${image_url || null},
        ${icon_name || null},
        ${nextOrder},
        ${is_active !== undefined ? is_active : true}
      )
      RETURNING *
    `;

    return Response.json(newService[0]);
  } catch (error) {
    console.error("Create service API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
