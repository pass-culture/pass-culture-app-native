import { TouchableOpacityProps } from 'react-native'

import { ColorsType } from 'theme/types'

export type TouchableProps = {
  type?: string
  onPress?: () => void
  testID?: string
  accessibilityLabel?: string
  accessibilityRole?: string
  hoverUnderlineColor?: ColorsType | null
} & TouchableOpacityProps
