import sql from "../utils/sql.js";

// Get company info
export async function GET(request) {
  try {
    const result = await sql`SELECT * FROM company_info LIMIT 1`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Company info not found" },
        { status: 404 },
      );
    }

    const company = result[0];
    return Response.json({
      success: true,
      data: {
        ...company,
        values: company.values || [],
      },
    });
  } catch (error) {
    console.error("Error fetching company info:", error);
    return Response.json(
      { success: false, error: "Failed to fetch company info" },
      { status: 500 },
    );
  }
}

// Update company info
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      company_name,
      tagline,
      description,
      mission,
      vision,
      values,
      phone,
      email,
      address,
      website,
      established_year,
      total_projects,
      years_experience,
      happy_clients,
    } = body;

    // Build dynamic update query
    const updates = [];
    const queryValues = [];
    let paramCount = 1;

    if (company_name !== undefined) {
      updates.push(`company_name = $${paramCount}`);
      queryValues.push(company_name);
      paramCount++;
    }
    if (tagline !== undefined) {
      updates.push(`tagline = $${paramCount}`);
      queryValues.push(tagline);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      queryValues.push(description);
      paramCount++;
    }
    if (mission !== undefined) {
      updates.push(`mission = $${paramCount}`);
      queryValues.push(mission);
      paramCount++;
    }
    if (vision !== undefined) {
      updates.push(`vision = $${paramCount}`);
      queryValues.push(vision);
      paramCount++;
    }
    if (values !== undefined) {
      updates.push(`values = $${paramCount}`);
      queryValues.push(JSON.stringify(values));
      paramCount++;
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      queryValues.push(phone);
      paramCount++;
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      queryValues.push(email);
      paramCount++;
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      queryValues.push(address);
      paramCount++;
    }
    if (website !== undefined) {
      updates.push(`website = $${paramCount}`);
      queryValues.push(website);
      paramCount++;
    }
    if (established_year !== undefined) {
      updates.push(`established_year = $${paramCount}`);
      queryValues.push(established_year);
      paramCount++;
    }
    if (total_projects !== undefined) {
      updates.push(`total_projects = $${paramCount}`);
      queryValues.push(total_projects);
      paramCount++;
    }
    if (years_experience !== undefined) {
      updates.push(`years_experience = $${paramCount}`);
      queryValues.push(years_experience);
      paramCount++;
    }
    if (happy_clients !== undefined) {
      updates.push(`happy_clients = $${paramCount}`);
      queryValues.push(happy_clients);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: "No fields provided for update" },
        { status: 400 },
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `UPDATE company_info SET ${updates.join(", ")} RETURNING *`;
    const result = await sql(query, queryValues);

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Company info not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: {
        ...result[0],
        values: result[0].values || [],
      },
    });
  } catch (error) {
    console.error("Error updating company info:", error);
    return Response.json(
      { success: false, error: "Failed to update company info" },
      { status: 500 },
    );
  }
}
