import { redis } from "@/lib/upstash";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const data = await redis.hgetall<{ long: string; clicks: number }>(`url:${code}`);

  if (!data?.long) {
    return new Response("Link não encontrado", { status: 404 });
  }

  // conta o clique (fire-and-forget, não atrasa o redirect)
  redis.hincrby(`url:${code}`, "clicks", 1);

  return Response.redirect(data.long);
}