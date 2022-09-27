import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

// @deprecated
export const GreyDarkCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
