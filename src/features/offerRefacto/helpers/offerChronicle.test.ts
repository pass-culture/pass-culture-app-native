import { ChroniclePreview } from 'api/gen'
import { advicePreviewToAdviceCardData } from 'features/offerRefacto/helpers'

jest.mock('libs/firebase/analytics/analytics')

describe('advicePreviewToAdviceCardData', () => {
  const ADVICE_PREVIEW: ChroniclePreview = {
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
    expect(advicePreviewToAdviceCardData(ADVICE_PREVIEW, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John, 13 ans',
    })
  })

  it('should convert ChroniclePreview to ChronicleCardData with no Author', () => {
    const data = { ...ADVICE_PREVIEW, author: null }

    expect(advicePreviewToAdviceCardData(data, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })
  })

  it('should convert ChroniclePreview to ChronicleCardData with partial Author', () => {
    const dataWithoutName = {
      ...ADVICE_PREVIEW,
      author: { ...ADVICE_PREVIEW.author, firstName: null },
    }
    const dataWithoutAge = {
      ...ADVICE_PREVIEW,
      author: { ...ADVICE_PREVIEW.author, age: null },
    }

    const dataWithEmptyAuthor = {
      ...ADVICE_PREVIEW,
      author: { ...ADVICE_PREVIEW.author, age: null, firstName: null },
    }

    expect(advicePreviewToAdviceCardData(dataWithoutName, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })

    expect(advicePreviewToAdviceCardData(dataWithoutAge, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: 'Membre du Book Club',
      title: 'John',
    })

    expect(advicePreviewToAdviceCardData(dataWithEmptyAuthor, subtitle)).toStrictEqual({
      date: 'Janvier 2025',
      description: 'lorem ipsum dolor',
      id: 1,
      subtitle: '',
      title: 'Membre du Book Club',
    })
  })
})
