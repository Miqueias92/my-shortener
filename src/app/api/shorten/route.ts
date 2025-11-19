import { redis } from "@/lib/upstash";
import { toBase62 } from "@/lib/base62";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { url, custom } = await request.json();

  if (!url || !url.startsWith("http")) {
    return Response.json({ error: "URL inválida" }, { status: 400 });
  }

  let shortCode: string;

  if (custom) {
    // permite código personalizado (ex: meu.link/github)
    const exists = await redis.exists(`url:${custom}`);
    if (await exists) {
      return Response.json({ error: "Código já existe" }, { status: 409 });
    }
    shortCode = custom;
  } else {
    // gera sequencial bonito
    const counter = await redis.incr("global:counter");
    shortCode = toBase62(counter);
    // garante mínimo 6 caracteres (opcional)
    while (shortCode.length < 6) {
      shortCode = "0" + shortCode;
    }
  }

  await redis.hset(`url:${shortCode}`, {
    long: url,
    clicks: 0,
    createdAt: Date.now(),
  });

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;

  return Response.json({ shortUrl, shortCode });
}