import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Save the contact inquiry to the database
    const inquiry = await sql`
      INSERT INTO contact_inquiries (
        first_name,
        last_name,
        email,
        phone,
        service,
        budget,
        timeline,
        message
      )
      VALUES (
        ${formData.firstName},
        ${formData.lastName},
        ${formData.email},
        ${formData.phone || null},
        ${formData.service || null},
        ${formData.budget || null},
        ${formData.timeline || null},
        ${formData.message}
      )
      RETURNING id, created_at
    `;

    // Log the contact form submission for debugging (remove in production)
    console.log("Contact Form Submission:", {
      id: inquiry[0].id,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      created_at: inquiry[0].created_at,
    });

    // In a real application, you would also:
    // 1. Send an email notification to your team
    // 2. Send a confirmation email to the customer
    // 3. Integrate with a CRM system

    return Response.json(
      {
        success: true,
        message:
          "Thank you for your inquiry! We will get back to you within 24 hours.",
        inquiry_id: inquiry[0].id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
