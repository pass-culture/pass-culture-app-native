import styled from 'styled-components/native'

import {
  scrollButtonStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'

export const ScrollButtonForNotTouchDevice = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<ScrollButtonForNotTouchDeviceProps>(scrollButtonStyles)
