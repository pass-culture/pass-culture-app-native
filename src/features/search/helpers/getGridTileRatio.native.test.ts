import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'

const mockedMobileScreenWidth = 380
const mockedTabletScreenWidth = 1520

const expectedResultMobile = { tileWidth: 158, nbrOfTilesToDisplay: 2 }
const expectedTabletMobile = { tileWidth: 149.33333333333334, nbrOfTilesToDisplay: 6 }

describe('getGridTileRatio', () => {
  it('should return correct amount of tiles and tile width for a mobile', () => {
    const result = getGridTileRatio(mockedMobileScreenWidth)

    expect(result).toEqual(expectedResultMobile)
  })

  it('should return correct amount of tiles and tile width for a tablet', () => {
    const result = getGridTileRatio(mockedTabletScreenWidth)

    expect(result).toEqual(expectedTabletMobile)
  })
})
