import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { BASE_URL, fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { mockServer } from 'tests/mswServer'

describe('Contentful fetchHomepageNatifContent', () => {
  it('should retrieve a list of adapted homepages', async () => {
    mockServer.universalGet(BASE_URL + '/entries', homepageEntriesAPIResponse)

    const result = await fetchHomepageNatifContent()
    expect(result).toEqual(homepageList)
  })
})
