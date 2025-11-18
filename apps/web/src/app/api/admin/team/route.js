import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamMembers = await sql`
      SELECT 
        id,
        name,
        position,
        bio,
        image_url,
        email,
        phone,
        order_position,
        is_active,
        created_at,
        updated_at
      FROM team_members
      ORDER BY order_position ASC, created_at ASC
    `;

    return Response.json(teamMembers);
  } catch (error) {
    console.error("Get team members API error:", error);
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
    const { name, position, bio, image_url, email, phone, is_active } = body;

    // Validate required fields
    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    // Get the next order position
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX(order_position), 0) as max_order
      FROM team_members
    `;
    const nextOrder = maxOrderResult[0].max_order + 1;

    const newMember = await sql`
      INSERT INTO team_members (
        name,
        position,
        bio,
        image_url,
        email,
        phone,
        order_position,
        is_active
      )
      VALUES (
        ${name},
        ${position || null},
        ${bio || null},
        ${image_url || null},
        ${email || null},
        ${phone || null},
        ${nextOrder},
        ${is_active !== undefined ? is_active : true}
      )
      RETURNING *
    `;

    return Response.json(newMember[0]);
  } catch (error) {
    console.error("Create team member API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
