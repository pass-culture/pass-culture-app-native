import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

type Props = {
  children: ReactNode
}

function MaxWidth(props: Props) {
  // @ts-ignore: typescript is not maintained by react-native-web
  return <MaxWidthContainer accessibilityRole="form">{props.children}</MaxWidthContainer>
}

function Flex(props: Props) {
  // @ts-ignore: typescript is not maintained by react-native-web
  return <FlexContainer accessibilityRole="form">{props.children}</FlexContainer>
}

const MaxWidthContainer = styled.View(({ theme }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const FlexContainer = styled.View({
  flex: 1,
})

export const Form = { Flex, MaxWidth }
