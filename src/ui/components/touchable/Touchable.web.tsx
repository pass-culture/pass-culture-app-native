import styled from 'styled-components'

import { appTouchableOpacityWebStyles } from 'ui/components/buttons/AppButton/styleUtils'

import { TouchableProps } from './types'

// REMOBE testID
export const Touchable = styled.button.attrs<TouchableProps>(
  ({ onPress, type, testID, accessibilityLabel, ...rest }) => ({
    tabIndex: '0',
    type: type || 'button',
    onClick: onPress,
    testID,
    'aria-label': accessibilityLabel,
    ...rest,
  })
)(appTouchableOpacityWebStyles)
