export const getSearchVenuePlaylistTitle = (
  isAccessibilityFiltered: boolean,
  venuePlaylistTitleFromUserData: string | undefined,
  isLocated: boolean
) => {
  let venuePlaylistTitle = venuePlaylistTitleFromUserData ?? 'Les lieux culturels'

  if (isAccessibilityFiltered) {
    venuePlaylistTitle += ' accessibles'
  }
  if (isLocated) {
    venuePlaylistTitle += ' près de toi'
  }

  return venuePlaylistTitle
}
