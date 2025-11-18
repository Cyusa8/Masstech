import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
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
      WHERE is_active = true
      ORDER BY order_position ASC, created_at DESC
    `;

    // Parse JSON arrays if they exist
    const projectsWithArrays = projects.map((project) => ({
      ...project,
      image_urls: project.image_urls ? JSON.parse(project.image_urls) : [],
      features: project.features ? JSON.parse(project.features) : [],
    }));

    return Response.json(projectsWithArrays);
  } catch (error) {
    console.error("Get public projects API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
