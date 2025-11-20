import sql from "../utils/sql.js";

// Get all contact inquiries (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM contact_inquiries";
    let params = [];

    if (status) {
      query += " WHERE status = $1";
      params = [status];
    }

    query += " ORDER BY created_at DESC";

    const inquiries = await sql(query, params);

    return Response.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching contact inquiries:", error);
    return Response.json(
      { success: false, error: "Failed to fetch contact inquiries" },
      { status: 500 },
    );
  }
}

// Create new contact inquiry
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      service_interest,
      budget_range,
      timeline,
    } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO contact_inquiries (
        name, email, phone, subject, message, service_interest, budget_range, timeline
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${subject}, ${message}, ${service_interest}, ${budget_range}, ${timeline}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      message: "Thank you for your inquiry! We will get back to you soon.",
      data: result[0],
    });
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return Response.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 },
    );
  }
}

// Update contact inquiry status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { success: false, error: "Contact inquiry ID and status are required" },
        { status: 400 },
      );
    }

    const validStatuses = ["new", "contacted", "responded", "closed"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          error:
            "Invalid status. Must be one of: new, contacted, responded, closed",
        },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE contact_inquiries 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Contact inquiry not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating contact inquiry:", error);
    return Response.json(
      { success: false, error: "Failed to update contact inquiry" },
      { status: 500 },
    );
  }
}
