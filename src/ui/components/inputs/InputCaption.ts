import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const InputCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
