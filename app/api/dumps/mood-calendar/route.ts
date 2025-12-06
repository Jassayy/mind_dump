// app/api/dumps/moods/route.ts

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../../helpers/auth";
import { prisma } from "@/app/lib/prisma";
import { getMoodEmoji } from "@/lib/mood-emoji";

export async function GET(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rawMonth = searchParams.get("month") ?? "";
    const month = rawMonth.trim().replace(/\/$/, "");

    // Validate YYYY-MM
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Invalid month format. Use YYYY-MM" },
        { status: 400 }
      );
    }

    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const dumps = await prisma.dumps.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // result["2025-12-06"] = { emoji: "😊", dumps: [...] }
    const result: Record<string, { emoji: string; dumps: typeof dumps }> = {};

    for (const dump of dumps) {
      const dateKey = dump.createdAt.toISOString().split("T")[0];

      if (!result[dateKey]) {
        result[dateKey] = { emoji: "😐", dumps: [] };
      }

      result[dateKey].dumps.push(dump);
    }

    // Pick dominant mood per day
    for (const date in result) {
      const moods = result[date].dumps
        .map((d) => d.mood)
        .filter(Boolean) as string[];

      const counts: Record<string, number> = {};
      for (const mood of moods) {
        counts[mood] = (counts[mood] || 0) + 1;
      }

      const dominantMood =
        Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "neutral";

      result[date].emoji = getMoodEmoji(dominantMood);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in moods route:", error);
    return NextResponse.json(
      { error: "Error in mood-calendar route" },
      { status: 500 }
    );
  }
}
