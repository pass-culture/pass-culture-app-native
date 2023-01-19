export const getNavigateToThematicHomeConfig = (entryId: string) => {
  return {
    screen: 'ThematicHome',
    params: { homeId: entryId },
  }
}
