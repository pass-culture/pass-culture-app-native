import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const getHoverStyle = (underlineColor: ColorsEnum, isHover?: boolean) => {
  if (Platform.OS === 'web') {
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
