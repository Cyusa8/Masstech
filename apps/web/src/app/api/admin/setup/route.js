import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM auth_users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Generate a unique ID for the user
    const userId = Date.now();

    // Hash the password
    const hashedPassword = await hash(password);

    // Create the user with admin role
    const newUser = await sql`
      INSERT INTO auth_users (id, name, email, role)
      VALUES (${userId}, ${name}, ${email}, 'admin')
      RETURNING id, name, email, role
    `;

    // Create the credentials account
    await sql`
      INSERT INTO auth_accounts (
        "userId",
        type,
        provider,
        "providerAccountId",
        password
      )
      VALUES (
        ${userId},
        'credentials',
        'credentials',
        ${userId.toString()},
        ${hashedPassword}
      )
    `;

    return Response.json({
      success: true,
      message: "Admin account created successfully",
      user: newUser[0],
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return Response.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
