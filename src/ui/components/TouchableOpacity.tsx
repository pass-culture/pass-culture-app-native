// eslint-disable-next-line no-restricted-imports
import { TouchableOpacity as RNTouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

export const TouchableOpacity = styled(RNTouchableOpacity).attrs(({ activeOpacity, theme }) => ({
  activeOpacity: activeOpacity ?? theme.activeOpacity,
}))<{ unselectable?: boolean }>(({ unselectable }) => ({
  userSelect: unselectable ? 'none' : 'auto',
}))

// eslint-disable-next-line no-restricted-imports
export { TouchableOpacity as RNTouchableOpacity } from 'react-native'
