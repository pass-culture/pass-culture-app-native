import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { theme } from 'theme'

const mockedMobileScreenWidth = 380
const mockedTabletScreenWidth = 1520
const margin = theme.designSystem.size.spacing.xl
const gutter = theme.designSystem.size.spacing.l
const breakpoint = 1024
const expectedResultMobile = { tileWidth: 158, nbrOfTilesToDisplay: 2 }
const expectedTabletMobile = { tileWidth: 149.33333333333334, nbrOfTilesToDisplay: 6 }

describe('getGridTileRatio', () => {
  it('should return correct amount of tiles and tile width for a mobile', () => {
    const result = getGridTileRatio({
      screenWidth: mockedMobileScreenWidth,
      margin,
      gutter,
      breakpoint,
    })

    expect(result).toEqual(expectedResultMobile)
  })

  it('should return correct amount of tiles and tile width for a tablet', () => {
    const result = getGridTileRatio({
      screenWidth: mockedTabletScreenWidth,
      margin,
      gutter,
      breakpoint,
    })

    expect(result).toEqual(expectedTabletMobile)
  })
})
