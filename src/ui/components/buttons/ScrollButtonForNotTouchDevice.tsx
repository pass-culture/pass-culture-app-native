import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

const BUTTON_SIZE = getSpacing(10)
const HALF_BUTTON_SIZE = BUTTON_SIZE / 2
export const ScrollButtonForNotTouchDevice = styled.TouchableOpacity<{
  horizontalAlign: 'left' | 'right'
  top?: number
}>(({ theme, top, horizontalAlign }) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  height: BUTTON_SIZE,
  width: BUTTON_SIZE,
  right: horizontalAlign === 'right' ? getSpacing(2) : 'auto',
  left: horizontalAlign === 'left' ? getSpacing(2) : 'auto',
  top: top ? top - HALF_BUTTON_SIZE : 0,
  bottom: top ? 'auto' : 0,
  borderWidth: 1,
  borderRadius: HALF_BUTTON_SIZE,
  borderColor: theme.colors.greyMedium,
  backgroundColor: theme.colors.white,
  zIndex: theme.zIndex.playlistsButton,
}))
