import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { adaptHomepageNatifEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'

describe('adaptHomepageNatifEntries', () => {
  it('should adapt a list of HomepageNatifEntries', () => {
    const rawHomepageNatifEntries = [homepageNatifEntryFixture]
    const adaptedHomepageList = adaptHomepageNatifEntries(rawHomepageNatifEntries)

    expect(adaptedHomepageList).toStrictEqual([adaptedHomepage])
  })
})
