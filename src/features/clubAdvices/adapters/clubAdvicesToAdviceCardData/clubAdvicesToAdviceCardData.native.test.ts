import { clubAdvicesToAdviceCardData } from 'features/clubAdvices/adapters/clubAdvicesToAdviceCardData/clubAdvicesToAdviceCardData'
import { clubAdvicesFixture } from 'features/clubAdvices/fixtures/clubAdvices.fixture'

const subtitle = 'Membre du Book Club'

describe('clubAdvicesToAdviceCardData', () => {
  it('should transform club advices to advice card data', () => {
    const clubAdvices = [...clubAdvicesFixture]
    const result = clubAdvicesToAdviceCardData(clubAdvices, subtitle)

    expect(result).toEqual([
      {
        date: 'Janvier 2025',
        description: 'Chronique sur le produit Product 30 mais sans utilisateur.',
        id: 31,
        subtitle: '',
        title: 'Membre du Book Club',
      },
      {
        date: 'Janvier 2025',
        description:
          'Chronique sur le produit Product 30 écrite par l’utilisateur Jeanne Doux (2).',
        id: 1,
        subtitle: 'Membre du Book Club',
        title: 'Jeanne, 15 ans',
      },
    ])
  })
})
