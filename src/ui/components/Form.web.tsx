import React, { FormEvent } from 'react'
import styled from 'styled-components'

const MaxWidth: React.FC<{ flex?: number }> = styled.form.attrs({
  onSubmit: (e: FormEvent) => e.preventDefault(),
})<{ flex?: number; marginTop?: number }>(({ theme, flex, marginTop }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  flex,
  marginTop,
}))

const Flex: React.FC = styled.form.attrs({
  onSubmit: (e: FormEvent) => e.preventDefault(),
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
