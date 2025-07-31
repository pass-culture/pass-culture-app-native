import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { REM_TO_PX } from 'ui/theme/constants'

describe('getLineHeightPx', () => {
  it('should convert a rem string to px when shouldConvertRemToPx is true', () => {
    const result = getLineHeightPx('1.5rem', true)

    expect(result).toEqual(1.5 * REM_TO_PX)
  })

  it('should parse a rem string without multiplying if shouldConvertRemToPx is false', () => {
    const result = getLineHeightPx('1.5rem', false)

    expect(result).toEqual(1.5)
  })

  it('should parse a rem string without multiplying if shouldConvertRemToPx is undefined', () => {
    const result = getLineHeightPx('2rem', undefined)

    expect(result).toEqual(2)
  })

  it('should return the number directly if lineHeight is a number and shouldConvertRemToPx is true', () => {
    const result = getLineHeightPx(20, true)

    expect(result).toEqual(20)
  })

  it('should return the number directly if lineHeight is a number and shouldConvertRemToPx is false', () => {
    const result = getLineHeightPx(25.6, false)

    expect(result).toEqual(25.6)
  })

  it('should return the number directly if lineHeight is a number and shouldConvertRemToPx is undefined', () => {
    const result = getLineHeightPx(18, undefined)

    expect(result).toEqual(18)
  })
})
