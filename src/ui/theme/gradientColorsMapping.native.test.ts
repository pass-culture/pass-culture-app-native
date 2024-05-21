import { theme } from 'theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

describe('gradientColorsMapping', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.gold)
    expect(color[1]).toEqual(theme.colors.goldDark)
  })

  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.aquamarine)
    expect(color[1]).toEqual(theme.colors.aquamarineDark)
  })

  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.skyBlue)
    expect(color[1]).toEqual(theme.colors.skyBlueDark)
  })

  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.deepPink)
    expect(color[1]).toEqual(theme.colors.deepPinkDark)
  })

  it('should return coral color code', () => {
    const input = 'Coral'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.coral)
    expect(color[1]).toEqual(theme.colors.coralDark)
  })

  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.lilac)
    expect(color[1]).toEqual(theme.colors.lilacDark)
  })
})
