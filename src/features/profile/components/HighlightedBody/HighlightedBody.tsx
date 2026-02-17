import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
