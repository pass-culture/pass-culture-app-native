export const parseUrlParams = (url: string): Record<string, string | null> => {
  const [, search] = url.split('?')
  const params: Record<string, string> = {}

  if (search) {
    search.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      // @ts-expect-error: because of noUncheckedIndexedAccess
      params[key] = value
    })
  }

  return params
}
