import { Platform } from 'react-native'

import { ColorsTypeLegacy } from 'theme/types'

export const getHoverStyle = (underlineColor: ColorsTypeLegacy | null, isHover?: boolean) => {
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
