import sql from "../../utils/sql.js";
import { hash, verify } from "argon2";

// Admin login
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND role = 'admin'
    `;

    if (users.length === 0) {
      return Response.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Verify password
    try {
      const isValidPassword = await verify(user.password_hash, password);
      if (!isValidPassword) {
        return Response.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error("Password verification error:", error);
      return Response.json(
        { success: false, error: "Authentication failed" },
        { status: 500 },
      );
    }

    // Update last login
    await sql`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
    `;

    // For simplicity, we'll return a basic token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    return Response.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return Response.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}

// Verify token (for session validation)
export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "No valid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const [userId, timestamp] = decoded.split(":");

      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return Response.json(
          { success: false, error: "Token expired" },
          { status: 401 },
        );
      }

      // Find user
      const users = await sql`
        SELECT id, email, name, role FROM users WHERE id = ${userId} AND role = 'admin'
      `;

      if (users.length === 0) {
        return Response.json(
          { success: false, error: "Invalid token" },
          { status: 401 },
        );
      }

      return Response.json({
        success: true,
        data: { user: users[0] },
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Invalid token format" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return Response.json(
      { success: false, error: "Token validation failed" },
      { status: 500 },
    );
  }
}
