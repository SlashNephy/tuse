export const meatureTime = async <T>(
  fn: () => Promise<T>
): Promise<readonly [T, number]> => {
  const start = new Date().getTime()
  const result = await fn()
  const end = new Date().getTime()

  const elapsed = end - start
  return [result, elapsed] as const
}
