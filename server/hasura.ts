export async function hasuraExec<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const url = process.env.HASURA_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  const jwt = process.env.HASURA_JWT;

  if (!url || !adminSecret) {
    throw Object.assign(new Error("Missing HASURA_URL or HASURA_ADMIN_SECRET"), { status: 500 });
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-hasura-admin-secret": adminSecret,
  };
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`Hasura HTTP ${res.status}: ${text}`), { status: res.status });
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw Object.assign(new Error(json.errors.map((e: any) => e.message).join("; ")), { status: 500 });
  }

  return json.data as T;
}
