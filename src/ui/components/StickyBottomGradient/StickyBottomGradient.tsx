import React, { ComponentProps } from 'react'
import { styled } from 'styled-components/native'

import { Gradient } from 'ui/components/Gradient'

type StickyBottomGradientProps = Omit<ComponentProps<typeof Gradient>, 'bottomViewHeight'>

export const StickyBottomGradient = (props: StickyBottomGradientProps) => (
  <StickyBottomGradientBase {...props} bottomViewHeight={0} />
)

const StickyBottomGradientBase = styled(Gradient)({
  bottom: '100%',
})
