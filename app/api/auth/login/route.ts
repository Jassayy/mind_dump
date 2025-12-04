import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    //check if user exists or no
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User does not exist. Try signing up first",
        },
        {
          status: 401,
        }
      );
    }

    //password match
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          error: "Invalid password",
        },
        {
          status: 401,
        }
      );
    }

    //generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      }
    );
    // Set Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in prod
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      {
        error: "Error logging in",
      },
      {
        status: 400,
      }
    );
  }
}
