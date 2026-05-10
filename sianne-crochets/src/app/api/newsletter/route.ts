import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    await prisma.newsletter.create({ data: { email } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2002") return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
