type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

export async function hasuraQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const url = import.meta.env.VITE_HASURA_URL as string
  const secret = import.meta.env.VITE_HASURA_ADMIN_SECRET as string
  const jwt = import.meta.env.VITE_HASURA_JWT as string

  if (!url || !secret) {
    throw new Error("Missing Hasura environment variables (VITE_HASURA_URL, VITE_HASURA_ADMIN_SECRET)")
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-hasura-admin-secret": secret,
  }
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Hasura request failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as GraphQLResponse<T>
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map(e => e.message).join("; "))
  }

  if (!json.data) {
    throw new Error("Hasura response missing data")
  }

  return json.data
}
