import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  children?: ReactNode
  shouldBeAlignedFlexStart?: boolean
}

export const CustomKeyboardAvoidingView = ({ children, shouldBeAlignedFlexStart }: Props) => {
  return (
    <Container>
      <StyledKeyboardAvoidingView shouldBeAlignedFlexStart={shouldBeAlignedFlexStart}>
        <CenteredWebContainer>{children}</CenteredWebContainer>
      </StyledKeyboardAvoidingView>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})<{ shouldBeAlignedFlexStart?: boolean }>(({ theme, shouldBeAlignedFlexStart }) => ({
  flexGrow: 1,
  flexBasis: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.designSystem.color.background.default,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  paddingTop: theme.designSystem.size.spacing.xxl,
  alignItems: shouldBeAlignedFlexStart ? 'flex-start' : 'center',
  overflow: 'scroll',
}))

const CenteredWebContainer = styled.View(({ theme }) => ({
  ...(Platform.OS === 'web' && !theme.isMobileViewport
    ? { maxHeight: '100%', paddingBottom: theme.designSystem.size.spacing.xl }
    : { flex: 1 }),
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
