import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { pin } = await request.json();
  const adminPin = process.env.ADMIN_PIN;

  if (!adminPin) {
    return NextResponse.json({ error: 'PIN no configurado' }, { status: 500 });
  }

  if (pin === adminPin) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: 'PIN incorrecto' }, { status: 401 });
}
