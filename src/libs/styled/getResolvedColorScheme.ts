import { ColorSchemeName } from 'react-native'

import { ColorScheme, ColorSchemeType } from 'libs/styled/types'

export const getResolvedColorScheme = (
  storedScheme: ColorScheme,
  systemScheme: ColorSchemeName | null | undefined
): ColorSchemeType => {
  if (storedScheme === ColorScheme.LIGHT || storedScheme === ColorScheme.DARK) {
    return storedScheme
  }
  return systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
}
