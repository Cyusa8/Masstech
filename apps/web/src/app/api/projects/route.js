import sql from "../utils/sql.js";

// Get all projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    let query = "SELECT * FROM projects WHERE 1=1";
    let params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += " ORDER BY completion_date DESC, created_at DESC";

    if (limit) {
      const limitNum = parseInt(limit);
      query += ` LIMIT $${paramCount}`;
      params.push(limitNum);
    }

    const projects = await sql(query, params);

    return Response.json({
      success: true,
      data: projects.map((project) => ({
        ...project,
        images: project.images || [],
        features: project.features || [],
      })),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// Create new project
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      short_description,
      category,
      client,
      location,
      duration,
      completion_date,
      project_value,
      images = [],
      features = [],
      challenges,
      solutions,
      status = "completed",
    } = body;

    if (!title || !category) {
      return Response.json(
        { success: false, error: "Title and category are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO projects (
        title, description, short_description, category, client, location,
        duration, completion_date, project_value, images, features,
        challenges, solutions, status
      )
      VALUES (
        ${title}, ${description}, ${short_description}, ${category}, ${client}, ${location},
        ${duration}, ${completion_date}, ${project_value}, ${JSON.stringify(images)}, ${JSON.stringify(features)},
        ${challenges}, ${solutions}, ${status}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      data: {
        ...result[0],
        images: result[0].images || [],
        features: result[0].features || [],
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return Response.json(
      { success: false, error: "Failed to create project" },
      { status: 500 },
    );
  }
}

// Update project
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Build dynamic update query
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key] !== undefined,
    );
    if (fields.length === 0) {
      return Response.json(
        { success: false, error: "No fields to update" },
        { status: 400 },
      );
    }

    const setClause = fields
      .map((field, index) => {
        if (field === "images" || field === "features") {
          return `${field} = $${index + 2}`;
        }
        return `${field} = $${index + 2}`;
      })
      .join(", ");

    const values = [
      id,
      ...fields.map((field) => {
        if (field === "images" || field === "features") {
          return JSON.stringify(updateData[field] || []);
        }
        return updateData[field];
      }),
    ];

    const result = await sql(
      `
      UPDATE projects 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `,
      values,
    );

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: {
        ...result[0],
        images: result[0].images || [],
        features: result[0].features || [],
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return Response.json(
      { success: false, error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// Delete project
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      DELETE FROM projects WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return Response.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
