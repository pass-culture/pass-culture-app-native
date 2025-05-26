import React from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { getSpacing } from 'ui/theme'

export const AgeButtonContainer: React.ElementType = styled(GenericBanner)<{ dense?: boolean }>(
  ({ dense }) => ({
    paddingVertical: getSpacing(dense ? 4 : 6),
  })
)
