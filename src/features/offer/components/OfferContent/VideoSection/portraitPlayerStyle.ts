import { Platform, ViewStyle } from 'react-native'

export const PORTRAIT_PLAYER_STYLE: ViewStyle = {
  alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
}
