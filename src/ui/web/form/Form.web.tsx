import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type Props = {
  children: ReactNode
}

export function Form(props: Props) {
  // @ts-ignore TODO: fix when https://github.com/necolas/react-native-web/issues/2189#issuecomment-1008886405 is resolved
  return <Container accessibilityRole="form">{props.children}</Container>
}

const Container = styled.View({
  width: '100%',
  height: '100%',
  maxWidth: getSpacing(125),
})
