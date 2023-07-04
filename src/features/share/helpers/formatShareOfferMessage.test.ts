import { formatShareOfferMessage } from './formatShareOfferMessage'

describe('formatShareOffer', () => {
  it('should format share message with offer name and location name', async () => {
    expect(
      formatShareOfferMessage({
        offerName: 'Donjons & Dragons : L’Honneur des voleurs - VO',
        venueName: 'L’Orange Bleue*',
      })
    ).toEqual(
      'Retrouve "Donjons & Dragons : L’Honneur des voleurs - VO" chez "L’Orange Bleue*" sur le pass Culture'
    )
  })
})
