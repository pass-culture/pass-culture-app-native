import { getTabNavConfig } from 'features/navigation/TabBar/helpers'

export const getNavigateToThematicHomeConfig = (entryId: string) => {
  const navigationConfig = getTabNavConfig('Home', {
    entryId,
  })
  return {
    screen: navigationConfig[0],
    params: navigationConfig[1],
  }
}
