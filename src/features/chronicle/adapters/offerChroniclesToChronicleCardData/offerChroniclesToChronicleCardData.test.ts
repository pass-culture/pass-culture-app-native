import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { chroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'

const subtitle = 'Membre du Book Club'

describe('transformOfferChroniclesToChronicleCardData', () => {
  it('should transform offer chronicles to chronicle card data', () => {
    const chronicles = [...chroniclesFixture]
    const result = offerChroniclesToChronicleCardData(chronicles, subtitle)

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
