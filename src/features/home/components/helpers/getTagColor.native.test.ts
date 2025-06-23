import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { theme } from 'theme'

describe('getTagColor', () => {
  it('should return gold color code', () => {
    const input = 'Gold'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.goldDark)
  })

  it('should return aquamarine color code', () => {
    const input = 'Aquamarine'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.aquamarineDark)
  })

  it('should return skyBlue color code', () => {
    const input = 'SkyBlue'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.skyBlueDark)
  })

  it('should return deepPink color code', () => {
    const input = 'DeepPink'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.deepPinkDark)
  })

  it('should return coral color code', () => {
    const input = 'Coral'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.coralDark)
  })

  it('should return lilac color code', () => {
    const input = 'Lilac'

    const color = getTagColor(input)

    expect(color).toEqual(theme.colors.lilacDark)
  })

  it('should return black color code by default', () => {
    const input = ''

    const color = getTagColor(input)

    expect(color).toEqual(theme.designSystem.color.background.inverted)
  })
})
