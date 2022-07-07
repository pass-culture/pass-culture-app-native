import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const getHoverStyle = (underlineColor: ColorsEnum) => {
  if (Platform.OS === 'web') {
    return {
      ['&:hover']: {
        textDecoration: 'underline',
        textDecorationColor: underlineColor,
        ['&:disabled']: {
          textDecoration: 'none',
        },
      },
    }
  }
  return {}
}
