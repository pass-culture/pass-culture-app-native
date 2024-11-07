import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { mockServer } from 'tests/mswServer'

import { createContentful } from './contentful'
import { createContentfulGetHomeData } from './contentfulGetHomeData'

describe('Contentful contentfulGetHomeData', () => {
  it('should retrieve a list of adapted homepages', async () => {
    const domain = 'https://cdn.contentful.com'
    const environment = 'master'
    const spaceId = 'space-id'
    const contentful = createContentful({
      accessToken: 'accessToken',
      domain,
      environment,
      spaceId,
    })
    const url = `${domain}/spaces/${spaceId}/environments/${environment}/entries`
    mockServer.universalGet(url, homepageEntriesAPIResponse)
    const contentfulGetHomeData = createContentfulGetHomeData(contentful)
    const result = await contentfulGetHomeData()

    expect(result).toEqual(homepageList)
  })
})
