import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const BottomCardContentContainer = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
