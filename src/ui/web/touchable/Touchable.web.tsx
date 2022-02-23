import styled from 'styled-components'

import { appTouchableOpacityWebStyles } from 'ui/components/buttons/AppButton/styleUtils'

export const Touchable = styled.button.attrs<{
  type?: string
  onPress?: () => void
  // @ts-ignore will be remove in next ticket
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}>(({ onPress, type, activeOpacity, ...rest }) => ({
  tabIndex: '0',
  type: type || 'button',
  onClick: onPress,
  ...rest,
}))(appTouchableOpacityWebStyles)
