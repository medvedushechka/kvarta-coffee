import { NextRequest, NextResponse } from "next/server";
import { leadSchema, normalizeBelarusPhone } from "@/lib/lead";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return NextResponse.json({ error: "Ожидается JSON" }, { status: 415 });
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 12000) return NextResponse.json({ error: "Слишком большой запрос" }, { status: 413 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 12000) {
      return NextResponse.json({ error: "Слишком большой запрос" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Некорректные данные" }, { status: 400 }); }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Проверьте поля формы" }, { status: 400 });
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) {
    console.error("Lead storage is not configured");
    return NextResponse.json({ error: "Сервис заявок временно недоступен. Попробуйте позже." }, { status: 503 });
  }
  const data = parsed.data;
  const phone = normalizeBelarusPhone(data.phone)!;
  try {
    const upstream = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/submit_kvarta_lead`, {
      method: "POST",
      headers: {"Content-Type":"application/json", apikey: secret, Authorization: `Bearer ${secret}`},
      body: JSON.stringify({p_name:data.name,p_phone:phone,p_interest:data.interest,p_comment:data.comment,p_attribution:data.attribution}),
      cache: "no-store", signal: AbortSignal.timeout(8000)
    });
    if (!upstream.ok) {
      console.error("Lead storage returned status", upstream.status);
      return NextResponse.json({ error: "Не удалось отправить заявку. Попробуйте ещё раз." }, { status: 502 });
    }
    const result: unknown = await upstream.json();
    if (result === "duplicate") return NextResponse.json({ status:"duplicate", message:"Мы уже получили заявку с этого номера. Скоро свяжемся с вами." });
    if (result !== "created") throw new Error("Unexpected storage result");
    return NextResponse.json({ status:"created", message:"Заявка отправлена! Мы скоро вам перезвоним." }, { status: 201 });
  } catch (err) {
    console.error("Lead service error", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Не удалось отправить заявку. Попробуйте ещё раз." }, { status: 502 });
  }
}
