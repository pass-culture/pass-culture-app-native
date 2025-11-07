import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { fetchHomepageById, fetchHomepageNatifContent } from 'libs/contentful/fetchHomepages'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { mockServer } from 'tests/mswServer'

describe('Contentful fetchHomepageNatifContent', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, homepageEntriesAPIResponse)
  })

  it('should retrieve a list of adapted homepages', async () => {
    const result = await fetchHomepageNatifContent()

    expect(result).toEqual(homepageList)
  })
})

describe('Contentful fetchHomepageById', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, homepageEntriesAPIResponse)
  })

  it('should retrieve one homepage', async () => {
    const result = await fetchHomepageById('6DCThxvbPFKAo04SVRZtwY')

    expect(result).toEqual(homepageList[0])
  })
})
