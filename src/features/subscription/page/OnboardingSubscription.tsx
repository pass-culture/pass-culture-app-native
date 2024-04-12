import React from 'react'
import styled from 'styled-components/native'

import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OnboardingSubscription = () => {
  return (
    <SecondaryPageWithBlurHeader title="">
      <StyledTitle3>Choisis des thèmes à suivre</StyledTitle3>
      <Typo.Body>
        Tu recevras des notifs et/ou des mails pour ne rien rater des dernières sorties et
        actus&nbsp;!
      </Typo.Body>
    </SecondaryPageWithBlurHeader>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))``
