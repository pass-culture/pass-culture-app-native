import styled from 'styled-components/native'

import {
  scrollButtonStyles,
  ScrollButtonForNotTouchDeviceProps,
} from 'ui/components/buttons/scrollButtonForNotTouchDeviceUtils'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

export const ScrollButtonForNotTouchDevice =
  styled(TouchableOpacity)<ScrollButtonForNotTouchDeviceProps>(scrollButtonStyles)
