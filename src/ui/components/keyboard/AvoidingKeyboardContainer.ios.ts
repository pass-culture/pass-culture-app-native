import styled from 'styled-components/native'

import { AvoidingKeyboardContainerProps } from './types'

export const AvoidingKeyboardContainer = styled.View<AvoidingKeyboardContainerProps>(
  ({ keyboardHeight }) => ({
    bottom: keyboardHeight,
  })
)
