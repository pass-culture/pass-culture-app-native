import React, { FC } from 'react'
import styled from 'styled-components/native'

import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { Speaker } from 'ui/svg/icons/Speaker'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type Props = {
  userId: number
  offerId: number
  visible: boolean
  hideModal: () => void
}

type BaseSurveyModalProps = Props & {
  Illustration: React.FC<AccessibleIcon>
  title: string
  body: string
  surveyUrl: string
}

const BaseSurveyModal: FC<BaseSurveyModalProps> = ({
  userId,
  offerId,
  visible,
  hideModal,
  Illustration,
  title,
  body,
  surveyUrl,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title=""
      Illustration={Illustration}
      hideModal={hideModal}>
      <StyledTitle4>{title}</StyledTitle4>
      <StyledBody>{body}</StyledBody>
      <StyledButtonContainer>
        <ExternalTouchableLink
          as={Button}
          fullWidth
          wording="Donner mon avis"
          externalNav={{
            url: `${surveyUrl}?userId=${userId}&offerId=${offerId}`,
          }}
        />
      </StyledButtonContainer>
    </AppModalWithIllustration>
  )
}

const SURVEY_URL = 'https://passculture.qualtrics.com/jfe/form/SV_73XVjUQPO0bUiuq'

export const BookingCompletedSurveyModal: FC<Props> = (props) => (
  <BaseSurveyModal
    {...props}
    Illustration={StyledSpeakerIllustration}
    title="Tout s’est bien passé&nbsp;?"
    body="Prends 3 minutes pour nous aider à améliorer l’application en répondant à ce questionnaire"
    surveyUrl={SURVEY_URL}
  />
)

export const BookingCanceledSurveyModal: FC<Props> = (props) => (
  <BaseSurveyModal
    {...props}
    Illustration={StyledCanceledIllustration}
    title="Avant de partir..."
    body="Dis-nous ce qui t’empêche de réserver à travers un court questionnaire"
    surveyUrl={SURVEY_URL}
  />
)

const StyledSpeakerIllustration = styled(Speaker).attrs(({ theme }) => ({
  size: theme.designSystem.size.illustration.xs,
}))``

const StyledCanceledIllustration = styled(LifeBuoy).attrs(({ theme }) => ({
  size: theme.designSystem.size.illustration.xs,
}))``

const StyledButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.l,
  color: theme.designSystem.color.text.brandPrimary,
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
