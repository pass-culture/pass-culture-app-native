import { parseStringToNumber } from 'libs/contentful/adapters/helpers/parseStringToNumber'

describe('parseStringToNumber', () => {
  it.each`
    varS        | varN
    ${'2'}      | ${2}
    ${'azerty'} | ${undefined}
  `('should return the number associated to the stringified variable', ({ varS, varN }) => {
    expect(parseStringToNumber(varS)).toEqual(varN)
  })
})
