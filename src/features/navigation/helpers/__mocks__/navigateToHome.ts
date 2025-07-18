import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'

export const navigateToHome = jest.fn()
export const navigateToHomeConfig = {
  screen: homeNavigationConfig[0],
  params: homeNavigationConfig[1],
  fromRef: true,
}
