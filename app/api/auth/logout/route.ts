import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: "User logged out successfully",
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Error logging out! ", error);
    return NextResponse.json(
      {
        message: "Error logging out!",
      },
      {
        status: 400,
      }
    );
  }
}
