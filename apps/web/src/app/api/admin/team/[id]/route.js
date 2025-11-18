import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const setClauses = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "name",
      "position",
      "bio",
      "image_url",
      "email",
      "phone",
      "order_position",
      "is_active",
    ];

    allowedFields.forEach((field) => {
      if (field in body) {
        paramCount++;
        setClauses.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    });

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Add updated_at
    paramCount++;
    setClauses.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add id for WHERE clause
    paramCount++;
    values.push(parseInt(id));

    const query = `
      UPDATE team_members 
      SET ${setClauses.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Team member not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Update team member API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const result = await sql`
      DELETE FROM team_members 
      WHERE id = ${parseInt(id)}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Team member not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete team member API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
