import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function checkAuth(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
  } catch (error) {
    return null;
  }
}
