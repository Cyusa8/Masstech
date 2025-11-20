import sql from "../../utils/sql.js";

// Get single project
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid project ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`SELECT * FROM projects WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    const project = result[0];
    return Response.json({
      success: true,
      data: {
        ...project,
        images: project.images || [],
        features: project.features || [],
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return Response.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// Update project
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid project ID is required" },
        { status: 400 },
      );
    }

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
      images,
      features,
      challenges,
      solutions,
      status,
    } = body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (short_description !== undefined) {
      updates.push(`short_description = $${paramCount}`);
      values.push(short_description);
      paramCount++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (client !== undefined) {
      updates.push(`client = $${paramCount}`);
      values.push(client);
      paramCount++;
    }
    if (location !== undefined) {
      updates.push(`location = $${paramCount}`);
      values.push(location);
      paramCount++;
    }
    if (duration !== undefined) {
      updates.push(`duration = $${paramCount}`);
      values.push(duration);
      paramCount++;
    }
    if (completion_date !== undefined) {
      updates.push(`completion_date = $${paramCount}`);
      values.push(completion_date);
      paramCount++;
    }
    if (project_value !== undefined) {
      updates.push(`project_value = $${paramCount}`);
      values.push(project_value);
      paramCount++;
    }
    if (images !== undefined) {
      updates.push(`images = $${paramCount}`);
      values.push(JSON.stringify(images));
      paramCount++;
    }
    if (features !== undefined) {
      updates.push(`features = $${paramCount}`);
      values.push(JSON.stringify(features));
      paramCount++;
    }
    if (challenges !== undefined) {
      updates.push(`challenges = $${paramCount}`);
      values.push(challenges);
      paramCount++;
    }
    if (solutions !== undefined) {
      updates.push(`solutions = $${paramCount}`);
      values.push(solutions);
      paramCount++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: "No fields provided for update" },
        { status: 400 },
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE projects 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

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
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid project ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`DELETE FROM projects WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Project deleted successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return Response.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
