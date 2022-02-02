import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type Props = {
  horizontalAlign: 'left' | 'right'
  top?: number
  children?: JSX.Element
  onPress?: () => void
}

export function ScrollButtonForNotTouchDevice(props: Props) {
  const accessibilityDescription =
    props.horizontalAlign === 'left'
      ? t`voir les propositions précédentes`
      : t`voir les propositions suivantes`
  return (
    <StyledTouchable {...props} aria-describedby={accessibilityDescription} aria-role="button" />
  )
}

const StyledTouchable = styled.TouchableOpacity<{
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
