/**
 * API routes normally return JSON, but an edge/serverless platform may end a
 * request before the handler can serialize a body (for example on a timeout).
 * Reading through response.json() leaks a low-level SyntaxError to the user in
 * that case. This helper always turns the response into a useful API shape.
 */
export async function readApiResponse<T extends object>(
  response: Response,
  fallbackMessage: string
): Promise<Partial<Omit<T, "error">> & { error?: string }> {
  type Result = Partial<Omit<T, "error">> & { error?: string }
  const raw = await response.text()
  if (!raw.trim()) {
    return {
      error:
        response.status === 502 || response.status === 503 || response.status === 504
          ? "Сервис не успел завершить генерацию. Попробуйте ещё раз через минуту."
          : fallbackMessage,
    } as Result
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Result
    }
  } catch {
    // The response can be an HTML error page produced by the hosting layer.
  }

  return {
    error: response.ok ? fallbackMessage : "Сервис временно недоступен. Попробуйте ещё раз.",
  } as Result
}
