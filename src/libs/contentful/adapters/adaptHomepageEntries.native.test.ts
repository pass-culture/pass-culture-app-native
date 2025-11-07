import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { adaptHomepageEntry } from 'libs/contentful/adapters/adaptHomepageEntries'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'

describe('adaptHomepageEntries', () => {
  it('should adapt a list of HomepageNatifEntries', () => {
    const adaptedHomepageList = adaptHomepageEntry(homepageNatifEntryFixture)

    expect(adaptedHomepageList).toStrictEqual(adaptedHomepage)
  })
})
