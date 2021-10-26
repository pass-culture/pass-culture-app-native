import url from 'url'

type QueryParams = Record<string, string>

export function getQueryParamsFromPath(path: string): QueryParams | null {
  const { search: stringQueryParams } = url.parse(path, true)
  if (!stringQueryParams) {
    return null
  }

  const uri = decodeURI(stringQueryParams)
  const sanitizedUri = uri
    .trim()
    .replace(/^\/+|\/+$/g, '') // removes external '/'
    .replace(/^\?+/g, '') // removes initial '?'
    .replace(/^&+|&+$/g, '') // removes external '&'

  const parameterFields: QueryParams = {}
  sanitizedUri.split('&').forEach((field) => {
    const [key, value] = field.split('=')
    parameterFields[key] = value
  })

  return parameterFields
}
