import { proAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { getAdvicesWithoutHeadline, getHeadlineAdvice } from 'features/venue/helpers/venueAdvices'

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

describe('getHeadlineAdvice', () => {
  it('should return undefined if no headline offer', () => {
    const result = getHeadlineAdvice([...proAdvicesFixture])

    expect(result).toEqual(undefined)
  })

  it('should return the most recent advice as headline offer advice when defined', () => {
    const result = getHeadlineAdvice([...proAdvicesFixture], '1')

    expect(result).toEqual(proAdvicesFixture[0])
  })
})
