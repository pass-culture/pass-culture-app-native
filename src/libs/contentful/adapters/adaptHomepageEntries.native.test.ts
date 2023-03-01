import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { adaptHomepageEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'

describe('adaptHomepageEntries', () => {
  it('should adapt a list of HomepageNatifEntries', () => {
    const rawHomepageNatifEntries = [homepageNatifEntryFixture]
    const adaptedHomepageList = adaptHomepageEntries(rawHomepageNatifEntries)

    expect(adaptedHomepageList).toStrictEqual([adaptedHomepage])
  })
})
