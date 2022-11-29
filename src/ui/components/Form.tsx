import React from 'react'
import styled from 'styled-components/native'

const MaxWidth: React.FC<{ flex?: number }> = styled.View<{ flex?: number }>(({ theme, flex }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  flex,
}))

const Flex: React.FC = styled.View({
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
