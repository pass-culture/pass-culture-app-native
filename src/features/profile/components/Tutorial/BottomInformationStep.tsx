import React from 'react'
import styled from 'styled-components/native'

import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { Typo } from 'ui/theme'

export const BottomInformationStep = () => (
  <InternalStep
    key="optional"
    variant={StepVariant.unknown}
    iconComponent={<GreyOffers />}
    isLast
    addMoreSpacingToIcons>
    <Container gap={2}>
      <StyledButtonText>{`Explore tout ce que la culture peut offrir, avec ou sans crédit\u00a0!`}</StyledButtonText>
      <StyledCaption>{`Tu peux continuer à réserver des offres gratuites autour de chez toi.`}</StyledCaption>
    </Container>
  </InternalStep>
)

const Container = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledButtonText = styled(Typo.BodyAccent).attrs({ numberOfLines: 3 })(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  justifyContent: 'center',
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  justifyContent: 'center',
}))

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``
