import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const TicketCodeTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  padding: getSpacing(2.5),
}))
