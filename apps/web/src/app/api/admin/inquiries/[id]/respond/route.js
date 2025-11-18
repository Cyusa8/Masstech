import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { message, recipientEmail, recipientName } = body;

    if (!message || !recipientEmail) {
      return Response.json(
        { error: "Message and recipient email are required" },
        { status: 400 },
      );
    }

    // Get company info for email sending
    const companyInfo = await sql`
      SELECT company_name, email, phone 
      FROM company_info 
      ORDER BY id 
      LIMIT 1
    `;

    const companyName = companyInfo[0]?.company_name || "MASS Tech Ltd";
    const fromEmail = companyInfo[0]?.email || "info@masstech.rw";

    // Get the inquiry details
    const inquiry = await sql`
      SELECT * FROM contact_inquiries WHERE id = ${parseInt(id)}
    `;

    if (inquiry.length === 0) {
      return Response.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // In a real application, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Mailgun
    // - Amazon SES
    // For now, we'll simulate successful email sending

    // Here's how you would typically send an email:
    /*
    const emailData = {
      from: `${companyName} <${fromEmail}>`,
      to: recipientEmail,
      subject: `Re: Your inquiry about ${inquiry[0].service || 'our services'}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Response to Your Inquiry</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h3>Your Original Message:</h3>
            <p><strong>Service:</strong> ${inquiry[0].service || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${inquiry[0].budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${inquiry[0].timeline || 'Not specified'}</p>
            <p><strong>Message:</strong> ${inquiry[0].message}</p>
          </div>
          
          <p style="margin-top: 20px;">
            Best regards,<br>
            ${companyName}<br>
            ${companyInfo[0]?.phone || ''}
          </p>
        </div>
      `
    };

    // Send email using your preferred email service
    await emailService.send(emailData);
    */

    // For demonstration, we'll just log the email and return success
    console.log("Email would be sent:", {
      from: `${companyName} <${fromEmail}>`,
      to: recipientEmail,
      subject: `Re: Your inquiry about ${inquiry[0].service || "our services"}`,
      message: message,
    });

    // Update the inquiry to add a note about the response
    const responseNote = `Response sent on ${new Date().toISOString()}: ${message.substring(0, 100)}...`;

    await sql`
      UPDATE contact_inquiries 
      SET 
        admin_notes = CASE 
          WHEN admin_notes IS NULL OR admin_notes = '' 
          THEN ${responseNote}
          ELSE admin_notes || '\n\n' || ${responseNote}
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `;

    return Response.json({
      success: true,
      message: "Response sent successfully",
      note: "In production, this would integrate with an email service like Resend, SendGrid, or similar.",
    });
  } catch (error) {
    console.error("Send response API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
