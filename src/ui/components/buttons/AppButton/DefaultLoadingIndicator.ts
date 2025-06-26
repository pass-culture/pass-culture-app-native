import styled from 'styled-components/native'

import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'

export const DefaultLoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  size: theme.icons.sizes.smaller,
}))``
