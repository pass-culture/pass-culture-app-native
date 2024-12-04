import { env } from 'libs/environment'

import { createContentful } from './contentful'
import { createContentfulGetHomeData } from './contentfulGetHomeData'

const contentful = createContentful({
  accessToken: env.CONTENTFUL_PUBLIC_ACCESS_TOKEN,
  domain: 'https://cdn.contentful.com',
  environment: env.CONTENTFUL_ENVIRONMENT,
  spaceId: env.CONTENTFUL_SPACE_ID,
})

export const contentfulGetHomeData = createContentfulGetHomeData(contentful)
