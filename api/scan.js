export async function POST(req: Request) {
  try {
    // your existing logic here

    return Response.json({ result });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    return Response.json({ error: "scan failed" }, { status: 500 });
  }
}