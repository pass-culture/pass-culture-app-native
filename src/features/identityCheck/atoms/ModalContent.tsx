import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const ModalContent = styled.View<{ centered?: boolean }>(({ centered = false }) => ({
  width: '100%',
  height: '100%',
  maxWidth: getSpacing(125),
  ...(centered && {
    alignItems: 'center',
  }),
}))
