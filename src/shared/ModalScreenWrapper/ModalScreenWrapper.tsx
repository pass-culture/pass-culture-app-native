import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

export type ModalScreenWrapperProps = {
  title: string
  onClose: () => void
  children: (closeWithTransition: () => void, titleId: string) => React.ReactNode
  fullScreen?: boolean
  desktopMaxWidth?: number
  desktopMaxHeight?: number | string
  desktopVariant?: 'centered' | 'bottomRight'
  initialFocusSelector?: string
}

export const ModalScreenWrapper = ({
  title,
  onClose,
  children,
  fullScreen: _fullScreen,
  desktopMaxWidth: _desktopMaxWidth,
  desktopMaxHeight: _desktopMaxHeight,
  desktopVariant: _desktopVariant,
  initialFocusSelector: _initialFocusSelector,
}: ModalScreenWrapperProps) => {
  const titleId = uuidv4()

  return (
    <Container accessibilityViewIsModal accessibilityLabel={title}>
      {children(onClose, titleId)}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
}))
