import { TouchableOpacityProps } from 'react-native'

export type TouchableProps = {
  type?: string
  onPress?: () => void
  testID?: string
  accessibilityLabel?: string
} & TouchableOpacityProps
