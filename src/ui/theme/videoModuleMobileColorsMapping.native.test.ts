import { theme } from 'theme'
import { videoModuleMobileColorsMapping } from 'ui/theme/videoModuleMobileColorsMapping'

describe('videoModuleMobileColorsMapping', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.goldLight100)
  })

  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.aquamarineLight)
  })

  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.skyBlueLight)
  })

  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.deepPinkLight)
  })

  it('should return coral color code', () => {
    const input = 'Coral'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.coralLight)
  })

  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = videoModuleMobileColorsMapping[input]

    expect(color).toEqual(theme.colors.lilacLight)
  })
})
