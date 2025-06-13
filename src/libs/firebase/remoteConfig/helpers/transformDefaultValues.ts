export const transformDefaultValues = (values: object): Record<string, string> => {
  const formattedEntries: [string, string][] = Object.entries(values).map(([key, value]) => {
    if (typeof value === 'object') {
      return [key, JSON.stringify(value)]
    }
    return [key, value]
  })
  return Object.fromEntries(formattedEntries)
}
