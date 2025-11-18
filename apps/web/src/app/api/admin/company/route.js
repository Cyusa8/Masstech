import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      ORDER BY id
      LIMIT 1
    `;

    return Response.json(companyInfo[0] || null);
  } catch (error) {
    console.error("Get company info API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
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
    } = body;

    // Check if company info already exists
    const existingInfo = await sql`
      SELECT id FROM company_info LIMIT 1
    `;

    let result;

    if (existingInfo.length > 0) {
      // Update existing record
      result = await sql`
        UPDATE company_info 
        SET 
          company_name = ${company_name || null},
          tagline = ${tagline || null},
          description = ${description || null},
          address = ${address || null},
          phone = ${phone || null},
          email = ${email || null},
          website = ${website || null},
          social_media = ${social_media ? JSON.stringify(social_media) : null},
          business_hours = ${business_hours ? JSON.stringify(business_hours) : null},
          logo_url = ${logo_url || null},
          hero_image_url = ${hero_image_url || null},
          about_image_url = ${about_image_url || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingInfo[0].id}
        RETURNING *
      `;
    } else {
      // Create new record
      result = await sql`
        INSERT INTO company_info (
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
          about_image_url
        )
        VALUES (
          ${company_name || null},
          ${tagline || null},
          ${description || null},
          ${address || null},
          ${phone || null},
          ${email || null},
          ${website || null},
          ${social_media ? JSON.stringify(social_media) : null},
          ${business_hours ? JSON.stringify(business_hours) : null},
          ${logo_url || null},
          ${hero_image_url || null},
          ${about_image_url || null}
        )
        RETURNING *
      `;
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Update company info API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
