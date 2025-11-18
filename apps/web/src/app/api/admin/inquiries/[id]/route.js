import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const inquiry = await sql`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        service,
        budget,
        timeline,
        message,
        status,
        admin_notes,
        created_at,
        updated_at
      FROM contact_inquiries
      WHERE id = ${id}
    `;

    if (inquiry.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return Response.json(inquiry[0]);
  } catch (error) {
    console.error("Get inquiry API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, admin_notes } = body;

    // Validate status
    const validStatuses = ["new", "in_progress", "resolved", "archived"];
    if (status && !validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    // Build update query dynamically
    const setClauses = [];
    const values = [];

    if (status) {
      setClauses.push(`status = $${values.length + 1}`);
      values.push(status);
    }

    if (admin_notes !== undefined) {
      setClauses.push(`admin_notes = $${values.length + 1}`);
      values.push(admin_notes);
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    if (setClauses.length === 1) {
      // Only timestamp was added
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updateQuery = `
      UPDATE contact_inquiries 
      SET ${setClauses.join(", ")} 
      WHERE id = $${values.length + 1}
      RETURNING *
    `;

    values.push(id);

    const result = await sql(updateQuery, values);

    if (result.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Update inquiry API error:", error);
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
      DELETE FROM contact_inquiries 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return Response.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Delete inquiry API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
