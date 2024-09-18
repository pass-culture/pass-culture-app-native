import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { mockServer } from 'tests/mswServer'

import { ContentfulAdapterFactory } from './adapters/ContentfulAdapterFactory'
import { adaptBusinessModule } from './adapters/modules/adaptBusinessModule'
import { adaptExclusivityModule } from './adapters/modules/adaptExclusivityModule'
import { adaptOffersModule } from './adapters/modules/adaptOffersModule'
import { Contentful, createContentful } from './contentful'
import { ContentfulGetHomeData, createContentfulGetHomeData } from './contentfulGetHomeData'
import { ContentTypes } from './types'

describe('Contentful contentfulGetHomeData', () => {
  let contentfulGetHomeData: ContentfulGetHomeData
  let contentfulAdapterFactory: ContentfulAdapterFactory
  let contentful: Contentful

  beforeEach(() => {
    const domain = 'https://cdn.contentful.com'
    const environment = 'master'
    const spaceId = 'space-id'
    contentful = createContentful({
      accessToken: 'accessToken',
      domain,
      environment,
      spaceId,
    })
    const url = `${domain}/spaces/${spaceId}/environments/${environment}/entries`
    mockServer.universalGet(url, { ...homepageEntriesAPIResponse })
    contentfulAdapterFactory = new ContentfulAdapterFactory()
    contentfulAdapterFactory.register(ContentTypes.ALGOLIA, adaptOffersModule)
    contentfulAdapterFactory.register(ContentTypes.BUSINESS, adaptBusinessModule)
    contentfulAdapterFactory.register(ContentTypes.EXCLUSIVITY, adaptExclusivityModule)

    contentfulGetHomeData = createContentfulGetHomeData(contentfulAdapterFactory, contentful)
  })

  it('should retrieve a list of adapted homepages', async () => {
    const result = await contentfulGetHomeData()

    expect(result).toEqual(homepageList)
  })
})
