import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'

describe('Contentful fetchHomepageNatifContent', () => {
  it('should retrieve a list of adapted homepages', async () => {
    const result = await fetchHomepageNatifContent()
    expect(result).toEqual(homepageList)
  })
})
