export function toArray<T>(input: T | T[] | null | undefined): T[] {
  if (input === null || input === undefined) {
    return []
  }
  return Array.isArray(input) ? input : [input]
}
