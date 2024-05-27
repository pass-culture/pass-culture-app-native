import { Platform } from 'react-native'

import { ColorsEnum } from 'ui/theme'

export const getHoverStyle = (underlineColor: ColorsEnum | null, isHover?: boolean) => {
  if (Platform.OS === 'web' && underlineColor) {
    const hoverStyle = {
      textDecoration: 'underline',
      textDecorationColor: underlineColor,
      ['&:disabled']: {
        textDecoration: 'none',
      },
    }
    if (isHover === undefined) {
      return {
        ['&:hover']: hoverStyle,
      }
    }
    return isHover ? hoverStyle : {}
  }
  return {}
}
