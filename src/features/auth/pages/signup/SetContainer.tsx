import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'

export const SetContainer: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const { designSystem } = useTheme()
  const marginTop = useMobileFontScaleToDisplay({
    default: 0,
    at200PercentZoom: designSystem.size.spacing.xxxl,
  })
  return <Container marginTop={marginTop}>{children}</Container>
}

const Container = styled.View<{ marginTop: number }>(({ marginTop }) => ({
  marginTop,
}))
