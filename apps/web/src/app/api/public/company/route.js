import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const companyInfo = await sql`
      SELECT 
        id,
        company_name,
        tagline,
        description,
        address,
        phone,
        email,
        website,
        social_media,
        business_hours,
        logo_url,
        hero_image_url,
        about_image_url,
        updated_at
      FROM company_info
      ORDER BY id ASC
      LIMIT 1
    `;

    if (companyInfo.length === 0) {
      // Return default company info if none exists
      return Response.json({
        company_name: "MASS Tech Ltd",
        tagline: "Building Excellence in Rwanda",
        description:
          "Premier construction company specializing in residential, commercial, and industrial projects with focus on quality, sustainability, and innovation.",
        address: "Kigali, Rwanda",
        phone: "+250 XXX XXX XXX",
        email: "info@masstech.rw",
        website: "",
        social_media: {},
        business_hours: {},
      });
    }

    // Parse JSON fields
    const company = companyInfo[0];
    return Response.json({
      ...company,
      social_media: company.social_media
        ? JSON.parse(company.social_media)
        : {},
      business_hours: company.business_hours
        ? JSON.parse(company.business_hours)
        : {},
    });
  } catch (error) {
    console.error("Get public company API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
