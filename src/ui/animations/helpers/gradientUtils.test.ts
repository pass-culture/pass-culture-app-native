import { patchGradientStops } from 'ui/animations/helpers/gradientUtils'
import { LottieColor, LottieGradient } from 'ui/animations/type'

const themedColor: LottieColor = [0.1, 0.2, 0.3, 1]
const expectNumber = (value: number | undefined): number => {
  expect(typeof value).toBe('number')

  return value as number
}

describe('patchGradientStops', () => {
  it('should updates all color components in gradient stops', () => {
    const gradient: LottieGradient = { k: { k: [0, 0, 0, 0, 1, 0.4, 0.5, 0.6] } }

    patchGradientStops(gradient, themedColor)

    const stops = gradient.k?.k

    expect(stops).toHaveLength(8)
    expect(expectNumber(stops?.[1])).toBeCloseTo(themedColor[0])
    expect(expectNumber(stops?.[2])).toBeCloseTo(themedColor[1])
    expect(expectNumber(stops?.[3])).toBeCloseTo(themedColor[2])
    expect(expectNumber(stops?.[5])).toBeCloseTo(themedColor[0])
    expect(expectNumber(stops?.[6])).toBeCloseTo(themedColor[1])
    expect(expectNumber(stops?.[7])).toBeCloseTo(themedColor[2])
    expect(expectNumber(stops?.[0])).toBe(0)
    expect(expectNumber(stops?.[4])).toBe(1)
  })

  it('should does nothing when stops are not an array', () => {
    const gradient: LottieGradient = { k: { k: undefined } }

    patchGradientStops(gradient, themedColor)

    expect(gradient.k?.k).toBeUndefined()
  })

  it('should does not throw if gradient has no k node', () => {
    const gradient: LottieGradient = {}

    expect(() => patchGradientStops(gradient, themedColor)).not.toThrow()
    expect(gradient.k).toBeUndefined()
  })
})
