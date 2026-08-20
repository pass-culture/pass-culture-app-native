import React from 'react'
import styled from 'styled-components/native'

export type ModalScreenWrapperProps = {
  title: string
  onClose: () => void
  children: (closeWithTransition: () => void) => React.ReactNode
  fullScreen?: boolean
}

export const ModalScreenWrapper = ({
  title: _title,
  onClose,
  children,
  fullScreen: _fullScreen,
}: ModalScreenWrapperProps) => <Container>{children(onClose)}</Container>

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
}))
