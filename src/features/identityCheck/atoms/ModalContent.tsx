import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
interface Props {
  centered?: boolean
  children: React.ReactNode
}

export const ModalContent = ({ centered = false, children }: Props) => {
  const { bottom } = useCustomSafeInsets()
  const safePaddingBottom = getSpacing(18) + bottom // Add enough space to be above the button
  return (
    <Container centered={centered} paddingBottom={safePaddingBottom}>
      {children}
    </Container>
  )
}

export const Container = styled.View<{ centered?: boolean; paddingBottom: number }>(
  ({ centered, paddingBottom }) => ({
    width: '100%',
    height: '100%',
    maxWidth: getSpacing(125),
    alignItems: centered ? 'center' : undefined,
    paddingBottom,
  })
)
