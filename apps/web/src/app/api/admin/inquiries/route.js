import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await sql`
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
      ORDER BY created_at DESC
    `;

    return Response.json(inquiries);
  } catch (error) {
    console.error("Get inquiries API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
