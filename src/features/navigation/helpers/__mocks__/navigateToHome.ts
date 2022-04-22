import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export const navigateToHome = jest.fn()
export const navigateToHomeConfig = {
  screen: homeNavConfig[0],
  params: homeNavConfig[1],
  fromRef: true,
}
