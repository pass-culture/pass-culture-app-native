import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { Info } from 'ui/svg/icons/Info'

import { matchSubscriptionMessageIconToSvg } from './matchSubscriptionMessageIconToSvg'

describe('matchSubscriptionMessageIconToSvg', () => {
  it('should return no icon if undefined is passed', () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg(undefined)
    expect(returnedIcon).toEqual(undefined)
  })
  it('should return no icon if undefined is passed and fallback is true', () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg(undefined, true)
    expect(returnedIcon).toEqual(undefined)
  })
  it("should return Clock if 'CLOCK' is passed", () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg('CLOCK')
    expect(returnedIcon).toEqual(BicolorClock)
  })
  it('should return Info if unknown string is passed and fallbackIcon is true', () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg('I am an unknown string', true)
    expect(returnedIcon).toEqual(Info)
  })
  it('should return no icon if unknown string is passed and fallback is false', () => {
    const returnedIcon = matchSubscriptionMessageIconToSvg('I am an unknown string')
    expect(returnedIcon).toEqual(undefined)
  })
})
