export const measureTime = async <T>(
  fn: () => Promise<T>
): Promise<readonly [T, number]> => {
  const start = Date.now()
  const result = await fn()
  const end = Date.now()

  const elapsed = end - start
  return [result, elapsed] as const
}
