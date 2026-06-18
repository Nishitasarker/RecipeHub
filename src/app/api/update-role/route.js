import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export async function POST(req) {
  const { email, role } = await req.json();
  
  await db.collection("user").updateOne(
    { email: email },
    { $set: { role: role } }
  );
  
  return Response.json({ success: true });
}