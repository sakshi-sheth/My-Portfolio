import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Sample skills data for now
    const skills = [
      { id: 1, name: "React", category: "frontend", proficiency: 90 },
      { id: 2, name: "TypeScript", category: "frontend", proficiency: 85 },
      { id: 3, name: "Node.js", category: "backend", proficiency: 80 },
      { id: 4, name: "MySQL", category: "backend", proficiency: 75 },
    ];

    res.status(200).json(skills);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
