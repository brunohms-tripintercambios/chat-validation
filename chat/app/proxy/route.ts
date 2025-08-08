import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();
    const {endpointPath, method = "POST", headers = {}, userId, message, ids} = body;

    console.log(endpointPath, method, headers, userId, message);

    if (!endpointPath) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const bodyPayload: Record<string, any> = {};
    if (userId) {
      bodyPayload["user_id"] = userId;
    }
    if (message) {
      bodyPayload.question = message;
    }
    if (ids) {
      bodyPayload.ids = ids;
    }
    console.log(`BODY: ${JSON.stringify(bodyPayload)}`);

    const url = `http://puffari-dev-ai-chat-alb-1262663991.us-east-1.elb.amazonaws.com${endpointPath}`;
    console.log(`URL: ${url}`);

    const t0 = Date.now();
    const upstream = await fetch(url, {
      method,
      headers: finalHeaders,
      body: Object.entries(bodyPayload).length !== 0 ? JSON.stringify(bodyPayload) : null,
    });
    const data = await upstream.json().catch(() => ({}));
    const elapsed = Date.now() - t0;

    console.log(data, upstream.status);

    return NextResponse.json(
      { ok: upstream.ok, status: upstream.status, data, elapsed },
      { status: upstream.ok ? 200 : upstream.status }
    );
  } catch (e: any) {
    console.error(`Error: ${e}`);
    return NextResponse.json({ error: e?.message ?? "Proxy error" }, { status: 500 });
  }
}
