import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
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
      WHERE is_active = true
      ORDER BY order_position ASC, created_at ASC
    `;

    return Response.json(teamMembers);
  } catch (error) {
    console.error("Get public team API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
