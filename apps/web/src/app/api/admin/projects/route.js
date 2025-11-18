import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await sql`
      SELECT 
        id,
        name,
        description,
        short_description,
        location,
        project_type,
        budget_range,
        completion_date,
        client_name,
        image_urls,
        status,
        features,
        order_position,
        is_featured,
        is_active,
        created_at,
        updated_at
      FROM projects
      ORDER BY order_position ASC, created_at DESC
    `;

    return Response.json(projects);
  } catch (error) {
    console.error("Get projects API error:", error);
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
      location,
      project_type,
      budget_range,
      completion_date,
      client_name,
      image_urls,
      status,
      features,
      is_featured,
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
      FROM projects
    `;
    const nextOrder = maxOrderResult[0].max_order + 1;

    const newProject = await sql`
      INSERT INTO projects (
        name,
        description,
        short_description,
        location,
        project_type,
        budget_range,
        completion_date,
        client_name,
        image_urls,
        status,
        features,
        order_position,
        is_featured,
        is_active
      )
      VALUES (
        ${name},
        ${description || null},
        ${short_description},
        ${location || null},
        ${project_type || null},
        ${budget_range || null},
        ${completion_date || null},
        ${client_name || null},
        ${image_urls && image_urls.length > 0 ? JSON.stringify(image_urls) : null},
        ${status || "completed"},
        ${features && features.length > 0 ? JSON.stringify(features) : null},
        ${nextOrder},
        ${is_featured !== undefined ? is_featured : false},
        ${is_active !== undefined ? is_active : true}
      )
      RETURNING *
    `;

    return Response.json(newProject[0]);
  } catch (error) {
    console.error("Create project API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
