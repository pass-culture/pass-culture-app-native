import { StyleProp, ViewStyle } from 'react-native'

export const isStyleObject = (
  style: StyleProp<ViewStyle>
): style is Record<string, string | number> => {
  return typeof style === 'object'
}
