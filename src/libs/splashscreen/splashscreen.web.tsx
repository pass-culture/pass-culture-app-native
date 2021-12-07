import React from 'react'

import { SplashScreenContextInterface } from './types'

/**
 * There is no splash screen in web, but for compatibility with other platforms,
 * we provide a function and a provider mocking the splashscreen context.
 */

export function useSplashScreenContext(): SplashScreenContextInterface {
  return { isSplashScreenHidden: true, hideSplashScreen: undefined }
}

export const SplashScreenProvider: React.FC<{ children: React.ReactElement }> = (props) =>
  props.children
