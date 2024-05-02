export const getSearchVenuePlaylistTitle = (
  accessibilityFiltered: boolean,
  venuePlaylistTitleFromUserData: string | undefined
) => {
  if (venuePlaylistTitleFromUserData && accessibilityFiltered) {
    return venuePlaylistTitleFromUserData.endsWith('près de toi')
      ? venuePlaylistTitleFromUserData.replace('près de toi', `accessibles près de toi`)
      : `${venuePlaylistTitleFromUserData} accessibles`
  }
  if (venuePlaylistTitleFromUserData) return venuePlaylistTitleFromUserData
  if (accessibilityFiltered) return 'Les lieux culturels accessibles'
  else return 'Les lieux culturels'
}
