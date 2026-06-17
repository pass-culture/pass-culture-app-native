import React from 'react'
import styled from 'styled-components/native'

export type ModalScreenWrapperProps = {
  onClose: () => void
  children: (closeWithTransition: () => void) => React.ReactNode
}

export const ModalScreenWrapper = ({ onClose, children }: ModalScreenWrapperProps) => (
  <Container>{children(onClose)}</Container>
)

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
}))
