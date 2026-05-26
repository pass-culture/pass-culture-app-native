import React from 'react'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { BlockDescriptionItem } from 'features/profile/components/Tutorial/BlockDescriptionItem'
import { DefaultStepContainer } from 'features/profile/components/Tutorial/DefaultStepContainer'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CakeTwoCandles } from 'ui/svg/icons/CakeTwoCandles'
import { Clock } from 'ui/svg/icons/Clock'
import { Lock } from 'ui/svg/icons/Lock'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const Credit18Step = ({ amount }) => (
  <InternalStep
    key="optional"
    variant={StepVariant.unknown}
    iconComponent={<GreyCakeTwoCandles />}
    addMoreSpacingToIcons>
    <DefaultStepContainer>
      <ViewGap gap={4}>
        <StyledBody>à 18 ans</StyledBody>
        <Typo.Title3>
          Tu reçois <StyledTitle3>{amount}</StyledTitle3>
        </Typo.Title3>
        <CreditProgressBar progress={1} />
        <AccessibleUnorderedList
          withPadding
          Separator={<Separator />}
          items={[
            <BlockDescriptionItem
              key={1}
              icon={<SmallLock />}
              text="Tu as jusqu’à la veille de tes 19 ans pour confirmer ton identité et activer ton crédit."
            />,
            <BlockDescriptionItem
              key={2}
              icon={<SmallClock />}
              text="Une fois activé, tout ton crédit expirera la veille de ton 21ème anniversaire."
            />,
          ]}
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

const GreyCakeTwoCandles = styled(CakeTwoCandles).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const SmallClock = styled(Clock).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const Separator = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.l,
}))
