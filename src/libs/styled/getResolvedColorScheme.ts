import { ColorScheme, ColorSchemeType } from 'libs/styled/types'

export const getResolvedColorScheme = (
  storedScheme: ColorScheme,
  systemScheme: 'light' | 'dark' | null | undefined
): ColorSchemeType => {
  if (storedScheme === ColorScheme.LIGHT || storedScheme === ColorScheme.DARK) {
    return storedScheme
  }
  return systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
}
