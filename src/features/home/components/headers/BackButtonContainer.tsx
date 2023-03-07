import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const BackButtonContainer = styled.View<{ statusBarHeight: number }>(
  ({ statusBarHeight, theme }) => ({
    position: 'absolute',
    borderRadius: theme.borderRadius.button,
    background: theme.colors.white,
    width: getSpacing(10),
    top: statusBarHeight + getSpacing(4),
    left: getSpacing(4),
    zIndex: theme.zIndex.floatingButton,
  })
)
