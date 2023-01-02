import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

export const ProfileContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(6),
}))
