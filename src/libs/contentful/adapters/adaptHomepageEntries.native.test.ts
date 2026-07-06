import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { ThematicHeaderType } from 'features/home/types'
import { adaptHomepageEntry } from 'libs/contentful/adapters/adaptHomepageEntries'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'
import { thematicCategoryInfoFixture } from 'libs/contentful/fixtures/thematicCategoryInfo.fixture'
import { env } from 'libs/environment/env'

describe('adaptHomepageEntries', () => {
  it('should adapt a list of HomepageNatifEntries', () => {
    const adaptedHomepageList = adaptHomepageEntry(homepageNatifEntryFixture)

    expect(adaptedHomepageList).toStrictEqual(adaptedHomepage)
  })

  it('should build a category header illustration URL from its Contentful name', () => {
    const adaptedHomepageWithCategoryHeader = adaptHomepageEntry({
      ...homepageNatifEntryFixture,
      fields: {
        ...homepageNatifEntryFixture.fields,
        thematicHeader: thematicCategoryInfoFixture,
      },
    })

    expect(adaptedHomepageWithCategoryHeader.thematicHeader).toEqual({
      type: ThematicHeaderType.Category,
      title: 'vos cinéma',
      titleParts: ['vos', 'cinéma'],
      subtitle: 'Sous-titre cinéma',
      color: 'Lilac',
      imageUrl: `${env.ILLUSTRATIONS_BASE_URL}/cinema.png`,
    })
  })

  it('should adapt category header title from title parts when displayed title is missing', () => {
    const thematicCategoryInfoFields = thematicCategoryInfoFixture.fields
    if (!thematicCategoryInfoFields)
      throw new Error('Missing thematic category info fixture fields')

    const { displayedTitle: _displayedTitle, ...thematicCategoryInfoFieldsWithoutDisplayedTitle } =
      thematicCategoryInfoFields

    const adaptedHomepageWithCategoryHeader = adaptHomepageEntry({
      ...homepageNatifEntryFixture,
      fields: {
        ...homepageNatifEntryFixture.fields,
        thematicHeader: {
          ...thematicCategoryInfoFixture,
          fields: {
            ...thematicCategoryInfoFieldsWithoutDisplayedTitle,
            titleParts: ['vos', 'recommandations'],
          },
        },
      },
    })

    expect(adaptedHomepageWithCategoryHeader.thematicHeader).toEqual(
      expect.objectContaining({
        type: ThematicHeaderType.Category,
        title: 'vos recommandations',
        titleParts: ['vos', 'recommandations'],
      })
    )
  })
})
