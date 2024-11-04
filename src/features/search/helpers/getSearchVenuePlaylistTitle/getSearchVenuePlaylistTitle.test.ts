import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'

describe('getSearchVenuePlaylistTitle', () => {
  it.each`
    playlistTitleFromAlgolia                 | accessibilityFilter | isLocated | expected
    ${'Les salles de concerts et festivals'} | ${true}             | ${false}  | ${'Les salles de concerts et festivals accessibles'}
    ${'Les salles de concerts et festivals'} | ${false}            | ${true}   | ${'Les salles de concerts et festivals près de toi'}
    ${'Les salles de concerts et festivals'} | ${false}            | ${false}  | ${'Les salles de concerts et festivals'}
    ${'Les salles de concerts et festivals'} | ${true}             | ${true}   | ${'Les salles de concerts et festivals accessibles près de toi'}
    ${undefined}                             | ${true}             | ${false}  | ${'Les lieux culturels accessibles'}
    ${undefined}                             | ${false}            | ${true}   | ${'Les lieux culturels près de toi'}
    ${undefined}                             | ${true}             | ${true}   | ${'Les lieux culturels accessibles près de toi'}
    ${undefined}                             | ${false}            | ${false}  | ${'Les lieux culturels'}
  `(
    'getSearchVenuePlaylistTitle($playlistTitle,$accessibilityFilter) \t= $expected',
    ({ accessibilityFilter, playlistTitleFromAlgolia, isLocated, expected }) => {
      expect(
        getSearchVenuePlaylistTitle(accessibilityFilter, playlistTitleFromAlgolia, isLocated)
      ).toEqual(expected)
    }
  )
})
