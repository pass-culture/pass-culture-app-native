import { ChroniclePreview } from 'api/gen'
import { BOOK_CLUB_SUBCATEGORIES, CINE_CLUB_SUBCATEGORIES } from 'features/offer/constant'
import {
  chroniclePreviewToChronicalCardData,
  chronicleVariant,
} from 'features/offerRefacto/helpers'

describe('chronicleVariant', () => {
  it('should define all Book Club subcategories', () => {
    BOOK_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant.titleSection).toEqual('La reco du Book Club')
      expect(variant.subtitleItem).toEqual('Membre du Book Club')
    })
  })

  it('should define all Ciné Club subcategories', () => {
    CINE_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant.titleSection).toEqual('La reco du Ciné Club')
      expect(variant.subtitleItem).toEqual('Membre du Ciné Club')
    })
  })
})

describe('chroniclePreviewToChronicleCardData', () => {
  const CHRONICLE_PREVIEW: ChroniclePreview = {
    id: 1,
    contentPreview: 'lorem ipsum dolor',
    dateCreated: '2025-01-20T23:32:13.978038Z',
    author: {
      firstName: 'John',
      age: 13,
      city: 'Paris',
    },
  }

  const subtitle = 'Membre du Book Club'

  it('should convert ChroniclePreview to ChronicleCardData with Author', () => {
    expect(chroniclePreviewToChronicalCardData(CHRONICLE_PREVIEW, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John, 13 ans',
    })
  })

  it('should convert ChroniclePreview to ChronicleCardData with no Author', () => {
    const data = { ...CHRONICLE_PREVIEW, author: null }

    expect(chroniclePreviewToChronicalCardData(data, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })
  })

  it('should convert ChroniclePreview to ChronicleCardData with partial Author', () => {
    const dataWithoutName = {
      ...CHRONICLE_PREVIEW,
      author: { ...CHRONICLE_PREVIEW.author, firstName: null },
    }
    const dataWithoutAge = {
      ...CHRONICLE_PREVIEW,
      author: { ...CHRONICLE_PREVIEW.author, age: null },
    }

    const dataWithEmptyAuthor = {
      ...CHRONICLE_PREVIEW,
      author: { ...CHRONICLE_PREVIEW.author, age: null, firstName: null },
    }

    expect(chroniclePreviewToChronicalCardData(dataWithoutName, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })

    expect(chroniclePreviewToChronicalCardData(dataWithoutAge, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John',
    })

    expect(chroniclePreviewToChronicalCardData(dataWithEmptyAuthor, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })
  })
})
