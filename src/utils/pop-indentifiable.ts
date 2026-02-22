export function popIndentifiable<T extends Identifiable>(
  { id, key }: {
    id?: number
    key?: number
  },
  array: T[],
): T[] {
  if (!(id ?? key)) {
    throw new Error('Invalid identifier object: must contain either \'id\' or \'key\'')
  }

  if (id) {
    return array.filter((item) => item.id !== id)
  }

  return array.filter((item) => item.key !== key)
}
