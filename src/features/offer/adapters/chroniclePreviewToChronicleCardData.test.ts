import { ChroniclePreview } from 'api/gen'

import { chroniclePreviewToChronicalCardData } from './chroniclePreviewToChronicleCardData'

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

describe('chroniclePreviewToChronicleCardData', () => {
  it('should convert ChroniclePreview to ChronicleCardData with Author', () => {
    expect(chroniclePreviewToChronicalCardData(CHRONICLE_PREVIEW)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John, 13 ans',
    })
  })

  it('should convert ChroniclePreview to ChronicleCardData with no Author', () => {
    const data = { ...CHRONICLE_PREVIEW, author: null }

    expect(chroniclePreviewToChronicalCardData(data)).toStrictEqual({
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

    expect(chroniclePreviewToChronicalCardData(dataWithoutName)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })

    expect(chroniclePreviewToChronicalCardData(dataWithoutAge)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John',
    })

    expect(chroniclePreviewToChronicalCardData(dataWithEmptyAuthor)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })
  })
})
