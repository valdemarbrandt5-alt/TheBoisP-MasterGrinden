import { NextResponse } from "next/server";
import { readLeaderboard } from "@/lib/cache";

export async function GET() {
  const data = readLeaderboard();
  return NextResponse.json(data);
}