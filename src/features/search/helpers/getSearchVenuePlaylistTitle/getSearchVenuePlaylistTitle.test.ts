import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'

describe('getSearchVenuePlaylistTitle', () => {
  it.each`
    playlistTitle                           | accessibilityFilter | expected
    ${'Les salles de concerts & festivals'} | ${true}             | ${'Les salles de concerts & festivals accessibles'}
    ${'Les salles de concerts & festivals'} | ${false}            | ${'Les salles de concerts & festivals'}
    ${'Les librairies près de toi'}         | ${true}             | ${'Les librairies accessibles près de toi'}
    ${'Les librairies près de toi'}         | ${false}            | ${'Les librairies près de toi'}
    ${undefined}                            | ${true}             | ${'Les lieux culturels accessibles'}
    ${undefined}                            | ${false}            | ${'Les lieux culturels'}
  `(
    'getSearchVenuePlaylistTitle($playlistTitle,$accessibilityFilter) \t= $expected',
    ({ accessibilityFilter, playlistTitle, expected }) => {
      expect(getSearchVenuePlaylistTitle(accessibilityFilter, playlistTitle)).toEqual(expected)
    }
  )
})
