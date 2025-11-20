import sql from "../utils/sql.js";

// Get all services
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = "SELECT * FROM services";
    let params = [];

    if (category) {
      query += " WHERE category = $1";
      params = [category];
    }

    query += " ORDER BY created_at DESC";

    const services = await sql(query, params);

    return Response.json({
      success: true,
      data: services.map((service) => ({
        ...service,
        process: service.process || [],
        benefits: service.benefits || [],
        features: service.features || [],
      })),
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// Create new service
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      short_description,
      image_url,
      icon,
      process = [],
      benefits = [],
      features = [],
      price_range,
      duration,
      category,
    } = body;

    if (!title || !category) {
      return Response.json(
        { success: false, error: "Title and category are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO services (
        title, description, short_description, image_url, icon, 
        process, benefits, features, price_range, duration, category
      )
      VALUES (
        ${title}, ${description}, ${short_description}, ${image_url}, ${icon},
        ${JSON.stringify(process)}, ${JSON.stringify(benefits)}, ${JSON.stringify(features)},
        ${price_range}, ${duration}, ${category}
      )
      RETURNING *
    `;

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
    console.error("Error creating service:", error);
    return Response.json(
      { success: false, error: "Failed to create service" },
      { status: 500 },
    );
  }
}

// Update service
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Service ID is required" },
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
        return `${field} = $${index + 2}`;
      })
      .join(", ");

    const values = [
      id,
      ...fields.map((field) => {
        if (
          field === "process" ||
          field === "benefits" ||
          field === "features"
        ) {
          return JSON.stringify(updateData[field] || []);
        }
        return updateData[field];
      }),
    ];

    const result = await sql(
      `
      UPDATE services 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `,
      values,
    );

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
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Service ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      DELETE FROM services WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return Response.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
