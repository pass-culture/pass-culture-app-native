import { useColorScheme, ColorScheme } from 'libs/styled/useColorScheme'
import { AnimationObject } from 'ui/animations/type'

type Props = {
  light: AnimationObject
  dark: AnimationObject
}

export function useAnimationToDisplay({ light, dark }: Props) {
  const colorScheme = useColorScheme()
  return colorScheme === ColorScheme.DARK ? dark : light
}
