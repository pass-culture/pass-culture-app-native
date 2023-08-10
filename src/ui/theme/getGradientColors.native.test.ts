import { theme } from 'theme'
import { getGradientColors } from 'ui/theme/getGradientColors'

describe('getTagColor', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.goldLight)
    expect(color[1]).toEqual(theme.colors.gold)
  })
  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.aquamarineLight)
    expect(color[1]).toEqual(theme.colors.aquamarine)
  })
  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.skyBlueLight)
    expect(color[1]).toEqual(theme.colors.skyBlue)
  })
  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.deepPinkLight)
    expect(color[1]).toEqual(theme.colors.deepPink)
  })
  it('should return coral color code', () => {
    const input = 'Coral'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.coralLight)
    expect(color[1]).toEqual(theme.colors.coral)
  })
  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.lilacLight)
    expect(color[1]).toEqual(theme.colors.lilac)
  })
  it('should return black color code by default', () => {
    const input = ''

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.white)
    expect(color[1]).toEqual(theme.colors.white)
  })
})
