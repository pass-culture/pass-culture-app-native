import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

type Props = {
  children: ReactNode
}

function MaxWidth(props: Props) {
  // @ts-ignore TODO: fix when https://github.com/necolas/react-native-web/issues/2189#issuecomment-1008886405 is resolved
  return <MaxWidthContainer accessibilityRole="form">{props.children}</MaxWidthContainer>
}

function Flex(props: Props) {
  // @ts-ignore TODO: fix when https://github.com/necolas/react-native-web/issues/2189#issuecomment-1008886405 is resolved
  return <FlexContainer accessibilityRole="form">{props.children}</FlexContainer>
}

const MaxWidthContainer = styled.View(({ theme }) => ({
  width: '100%',
  maxWidth: theme.desktopCenteredContentMaxWidth,
}))

const FlexContainer = styled.View({
  flex: 1,
})

export const Form = { Flex, MaxWidth }
