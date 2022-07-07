import { TouchableOpacityProps } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export type TouchableProps = {
  type?: string
  onPress?: () => void
  testID?: string
  accessibilityLabel?: string
  hoverUnderlineColor?: ColorsEnum | null
} & TouchableOpacityProps
