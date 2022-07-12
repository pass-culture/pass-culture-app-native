import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  children?: ReactNode
}

export const CustomKeyboardAvoidingView = (props: Props) => {
  const { top: topSafeInset } = useCustomSafeInsets()
  const { appBarHeight } = useTheme()
  return (
    <Container>
      <StyledKeyboardAvoidingView keyboardVerticalOffset={appBarHeight + topSafeInset}>
        <CenteredWebContainer>{props.children}</CenteredWebContainer>
      </StyledKeyboardAvoidingView>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})(({ theme }) => ({
  flexGrow: 1,
  flexBasis: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  paddingTop: getSpacing(3),
  alignItems: 'center',
  overflow: 'scroll',
}))

const CenteredWebContainer = styled.View(({ theme }) => ({
  ...(Platform.OS === 'web' && !theme.isMobileViewport
    ? { maxHeight: '100%', paddingBottom: getSpacing(6) }
    : { flex: 1 }),
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
