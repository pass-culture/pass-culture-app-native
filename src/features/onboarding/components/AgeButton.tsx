import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { getSpacing } from 'ui/theme'

export const AgeButton = styled(GenericBanner)<{ dense?: boolean }>(({ dense }) => ({
  paddingVertical: getSpacing(dense ? 4 : 6),
}))
