import { getGradientColors } from 'features/home/components/helpers/getGradientColors'
import { theme } from 'theme'

describe('getTagColor', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#FA9F16FF')
    expect(color[1]).toEqual(theme.colors.gold)
  })
  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#27DCA8FF')
    expect(color[1]).toEqual(theme.colors.aquamarine)
  })
  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#20C5E9FF')
    expect(color[1]).toEqual(theme.colors.skyBlue)
  })
  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#EC3478FF')
    expect(color[1]).toEqual(theme.colors.deepPink)
  })
  it('should return coral color code', () => {
    const input = 'Coral'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#F8733DFF')
    expect(color[1]).toEqual(theme.colors.coral)
  })
  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = getGradientColors(input)

    expect(color[0]).toEqual('#AD87FFFF')
    expect(color[1]).toEqual(theme.colors.lilac)
  })
  it('should return black color code by default', () => {
    const input = ''

    const color = getGradientColors(input)

    expect(color[0]).toEqual(theme.colors.white)
    expect(color[1]).toEqual(theme.colors.white)
  })
})
