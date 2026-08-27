import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RoundedButton, RoundedButtonProps } from 'ui/components/buttons/RoundedButton'

interface AbsoluteRoundedButtonProps extends RoundedButtonProps {
  direction: 'left' | 'right'
  top?: number
  testID?: string
}

export const AbsoluteRoundedButton: FunctionComponent<AbsoluteRoundedButtonProps> = ({
  direction,
  top,
  testID,
  ...buttonProps
}) => (
  <Container direction={direction} top={top} testID={testID}>
    <RoundedButton {...buttonProps} />
  </Container>
)

const Container = styled.View<{
  direction: 'left' | 'right'
  top?: number
}>(({ theme, direction, top }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.playlistsButton,
  left: direction === 'left' ? theme.designSystem.size.spacing.s : 'auto',
  right: direction === 'right' ? theme.designSystem.size.spacing.s : 'auto',
  top: top ? top - theme.buttons.scrollButton.size / 2 : 0,
  bottom: top ? 'auto' : 0,
  justifyContent: 'center',
  margin: 'auto',
}))
