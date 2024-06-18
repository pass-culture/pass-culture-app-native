import resolveResponse from 'contentful-resolve-response'

import { getExternal } from 'libs/fetch'

type ContentfulParams = {
  accessToken: string
  environment: string
  spaceId: string
  domain: string
}

export type Contentful = ReturnType<typeof createContentful>
type GetEntries = {
  depthLevel: number
  contentType: string
}

export const createContentful = ({
  domain,
  accessToken,
  environment,
  spaceId,
}: ContentfulParams) => {
  const baseUrl = new URL(`/spaces/${spaceId}/environments/${environment}`, domain)

  const getEntries = async <T>({ depthLevel, contentType }: GetEntries): Promise<T> => {
    const url = new URL(`${baseUrl}/entries`)
    url.search = new URLSearchParams({
      access_token: accessToken,
      include: depthLevel.toString(),
      content_type: contentType,
    }).toString()
    const json = await getExternal(url.toString())
    return resolveResponse(json)
  }

  return {
    getEntries,
  }
}
