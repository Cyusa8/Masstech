import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (optional role check)
    const user = await sql`
      SELECT role FROM auth_users WHERE id = ${session.user.id}
    `;

    if (user.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // For now, we'll assume all authenticated users can access admin
    // You can uncomment the following lines if you want strict role checking:
    // if (user[0].role !== 'admin') {
    //   return Response.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Get dashboard statistics
    const [
      totalInquiriesResult,
      newInquiriesResult,
      resolvedInquiriesResult,
      totalServicesResult,
      totalProjectsResult,
      totalTeamMembersResult,
    ] = await sql.transaction([
      sql`SELECT COUNT(*) as count FROM contact_inquiries`,
      sql`SELECT COUNT(*) as count FROM contact_inquiries WHERE status = 'new'`,
      sql`SELECT COUNT(*) as count FROM contact_inquiries WHERE status = 'resolved'`,
      sql`SELECT COUNT(*) as count FROM services WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM projects WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM team_members WHERE is_active = true`,
    ]);

    // Get recent inquiries (last 5)
    const recentInquiries = await sql`
      SELECT id, first_name, last_name, email, message, status, created_at
      FROM contact_inquiries
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return Response.json({
      totalInquiries: parseInt(totalInquiriesResult[0].count),
      newInquiries: parseInt(newInquiriesResult[0].count),
      resolvedInquiries: parseInt(resolvedInquiriesResult[0].count),
      totalServices: parseInt(totalServicesResult[0].count),
      totalProjects: parseInt(totalProjectsResult[0].count),
      totalTeamMembers: parseInt(totalTeamMembersResult[0].count),
      recentInquiries,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
