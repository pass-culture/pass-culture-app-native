import { theme } from 'theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

describe('gradientColorsMapping', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.goldLight)
    expect(color[1]).toEqual(theme.colors.gold)
  })

  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.aquamarineLight)
    expect(color[1]).toEqual(theme.colors.aquamarine)
  })

  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.skyBlueLight)
    expect(color[1]).toEqual(theme.colors.skyBlue)
  })

  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.deepPinkLight)
    expect(color[1]).toEqual(theme.colors.deepPink)
  })

  it('should return coral color code', () => {
    const input = 'Coral'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.coralLight)
    expect(color[1]).toEqual(theme.colors.coral)
  })

  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = gradientColorsMapping[input]

    expect(color[0]).toEqual(theme.colors.lilacLight)
    expect(color[1]).toEqual(theme.colors.lilac)
  })
})
