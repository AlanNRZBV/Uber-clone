import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(`${process.env.DB_URL}`);
    const response = await sql`SELECT * FROM drivers`;
    return Response.json({ data: response });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e });
  }
}
