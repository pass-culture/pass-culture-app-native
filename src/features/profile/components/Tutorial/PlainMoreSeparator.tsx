import React from 'react'
import styled from 'styled-components/native'

import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { PlainMore } from 'ui/svg/icons/PlainMore'

export const PlainMoreSeparator = () => (
  <InternalStep key="optional" variant={StepVariant.unknown}>
    <PlainMoreContainer>
      <StyledPlainMore />
    </PlainMoreContainer>
  </InternalStep>
)

const StyledPlainMore = styled(PlainMore).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.smaller,
}))``

const PlainMoreContainer = styled.View({
  alignItems: 'center',
})
