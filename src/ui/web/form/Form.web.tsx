import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

type Props = {
  children: ReactNode
}

export function Form(props: Props) {
  // @ts-ignore TODO: fix when https://github.com/necolas/react-native-web/issues/2189#issuecomment-1008886405 is resolved
  return <FormFlex accessibilityRole="form">{props.children}</FormFlex>
}

const FormFlex = styled.View({
  flex: 1,
})
