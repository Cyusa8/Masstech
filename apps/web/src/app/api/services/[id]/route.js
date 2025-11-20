import sql from "../../utils/sql.js";

// Get single service
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid service ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`SELECT * FROM services WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }

    const service = result[0];
    return Response.json({
      success: true,
      data: {
        ...service,
        process: service.process || [],
        benefits: service.benefits || [],
        features: service.features || [],
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return Response.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 },
    );
  }
}

// Update service
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid service ID is required" },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      short_description,
      image_url,
      icon,
      process,
      benefits,
      features,
      price_range,
      duration,
      category,
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
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount}`);
      values.push(image_url);
      paramCount++;
    }
    if (icon !== undefined) {
      updates.push(`icon = $${paramCount}`);
      values.push(icon);
      paramCount++;
    }
    if (process !== undefined) {
      updates.push(`process = $${paramCount}`);
      values.push(JSON.stringify(process));
      paramCount++;
    }
    if (benefits !== undefined) {
      updates.push(`benefits = $${paramCount}`);
      values.push(JSON.stringify(benefits));
      paramCount++;
    }
    if (features !== undefined) {
      updates.push(`features = $${paramCount}`);
      values.push(JSON.stringify(features));
      paramCount++;
    }
    if (price_range !== undefined) {
      updates.push(`price_range = $${paramCount}`);
      values.push(price_range);
      paramCount++;
    }
    if (duration !== undefined) {
      updates.push(`duration = $${paramCount}`);
      values.push(duration);
      paramCount++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
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
      UPDATE services 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: {
        ...result[0],
        process: result[0].process || [],
        benefits: result[0].benefits || [],
        features: result[0].features || [],
      },
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return Response.json(
      { success: false, error: "Failed to update service" },
      { status: 500 },
    );
  }
}

// Delete service
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return Response.json(
        { success: false, error: "Valid service ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`DELETE FROM services WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Service deleted successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return Response.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
