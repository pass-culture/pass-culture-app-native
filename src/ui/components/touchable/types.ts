import { TouchableOpacityProps } from 'react-native'

import { ColorsEnum } from 'ui/theme'

export type TouchableProps = {
  type?: string
  onPress?: () => void
  testID?: string
  accessibilityLabel?: string
  hoverUnderlineColor?: ColorsEnum | null
} & TouchableOpacityProps
