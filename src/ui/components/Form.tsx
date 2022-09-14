import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

const FormView: React.FC = styled.View.attrs({
  accessibilityRole: AccessibilityRole.FORM,
})``

const MaxWidth: React.FC<{ flex?: number }> = styled(FormView)<{ flex?: number }>(
  ({ theme, flex }) => ({
    width: '100%',
    maxWidth: theme.forms.maxWidth,
    flex,
  })
)

const Flex: React.FC = styled(FormView)({
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
