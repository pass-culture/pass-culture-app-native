import React from 'react'
import styled from 'styled-components'

const MaxWidth: React.FC<{ flex?: number }> = styled.form<{ flex?: number }>(({ theme, flex }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  flex,
}))

const Flex: React.FC = styled.form({
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
