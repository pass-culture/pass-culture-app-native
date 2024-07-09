import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { getShadow, getSpacing } from 'ui/theme'

/* On Android, Touchables react weirdly to children with shadow, we have some component that where used inside both Touchables 
and nonTouchables that needed to get rid of this shadow so we have this wrapper for nonTouchable ones. */

export const ShadowWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <Container>{children}</Container>
}

const Container = styled.View(({ theme }) => ({
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))
