import { proAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { getAdvicesWithoutHeadline } from 'features/venue/helpers/venueAdvices'

describe('getAdvicesWithoutHeadline', () => {
  it('should return all advices if no headline offer', () => {
    const result = getAdvicesWithoutHeadline([...proAdvicesFixture])

    expect(result).toEqual(proAdvicesFixture)
  })

  it('should return advices without the most recent advice of headline offer when defined', () => {
    const result = getAdvicesWithoutHeadline([...proAdvicesFixture], '1')

    expect(result).toEqual([proAdvicesFixture[1]])
  })
})
