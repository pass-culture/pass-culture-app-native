import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const ScrollButtonForNotTouchDevice = styled.TouchableOpacity<{
  horizontalAlign: 'left' | 'right'
  top?: number
}>(({ theme, top, horizontalAlign }) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  height: theme.buttons.scrollButton.size,
  width: theme.buttons.scrollButton.size,
  right: horizontalAlign === 'right' ? getSpacing(2) : 'auto',
  left: horizontalAlign === 'left' ? getSpacing(2) : 'auto',
  top: top ? top - theme.buttons.scrollButton.size / 2 : 0,
  bottom: top ? 'auto' : 0,
  borderWidth: 1,
  borderRadius: theme.buttons.scrollButton.size / 2,
  borderColor: theme.colors.greyMedium,
  backgroundColor: theme.colors.white,
  zIndex: theme.zIndex.playlistsButton,
}))
