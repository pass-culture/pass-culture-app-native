import React from 'react'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { BlockDescriptionItem } from 'features/profile/components/Tutorial/BlockDescriptionItem'
import { DefaultStepContainer } from 'features/profile/components/Tutorial/DefaultStepContainer'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CakeOneCandle } from 'ui/svg/icons/CakeOneCandle'
import { Lock } from 'ui/svg/icons/Lock'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const Credit17Step = ({ amount }) => (
  <InternalStep
    key="optional"
    variant={StepVariant.unknown}
    iconComponent={<GreyCakeOneCandle />}
    addMoreSpacingToIcons>
    <DefaultStepContainer>
      <ViewGap gap={4}>
        <StyledBody>à 17 ans</StyledBody>
        <Typo.Title3>
          Tu reçois <StyledTitle3>{amount}</StyledTitle3>
        </Typo.Title3>
        <CreditProgressBar progress={0.5} />
        <BlockDescriptionItem
          icon={<SmallLock />}
          text="Tu as jusqu’à la veille de tes 18 ans pour confirmer ton identité et activer ton crédit."
        />
      </ViewGap>
    </DefaultStepContainer>
  </InternalStep>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledTitle3 = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const GreyCakeOneCandle = styled(CakeOneCandle).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``
