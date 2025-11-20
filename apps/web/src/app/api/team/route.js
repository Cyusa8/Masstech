import sql from "../utils/sql.js";

// Get all team members
export async function GET(request) {
  try {
    const teamMembers = await sql`
      SELECT * FROM team_members 
      ORDER BY years_experience DESC, created_at ASC
    `;

    return Response.json({
      success: true,
      data: teamMembers.map((member) => ({
        ...member,
        specialties: member.specialties || [],
      })),
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return Response.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}

// Create new team member
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      position,
      bio,
      image_url,
      email,
      linkedin_url,
      years_experience,
      specialties = [],
    } = body;

    if (!name || !position) {
      return Response.json(
        { success: false, error: "Name and position are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO team_members (
        name, position, bio, image_url, email, linkedin_url, 
        years_experience, specialties
      )
      VALUES (
        ${name}, ${position}, ${bio}, ${image_url}, ${email}, ${linkedin_url},
        ${years_experience}, ${JSON.stringify(specialties)}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      data: {
        ...result[0],
        specialties: result[0].specialties || [],
      },
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return Response.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 },
    );
  }
}

// Update team member
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Team member ID is required" },
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
        if (field === "specialties") {
          return `${field} = $${index + 2}`;
        }
        return `${field} = $${index + 2}`;
      })
      .join(", ");

    const values = [
      id,
      ...fields.map((field) => {
        if (field === "specialties") {
          return JSON.stringify(updateData[field] || []);
        }
        return updateData[field];
      }),
    ];

    const result = await sql(
      `
      UPDATE team_members 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `,
      values,
    );

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Team member not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: {
        ...result[0],
        specialties: result[0].specialties || [],
      },
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return Response.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 },
    );
  }
}

// Delete team member
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Team member ID is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      DELETE FROM team_members WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Team member not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return Response.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 },
    );
  }
}
