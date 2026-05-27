import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Typo } from 'ui/theme'

type Props = {
  userId: number
  offerId: number
  visible: boolean
  hideModal: () => void
}

export const QualtricsSurveyModal: FunctionComponent<Props> = ({
  userId,
  offerId,
  visible,
  hideModal,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title=""
      Illustration={StyledIllustration}
      hideModal={hideModal}>
      <StyledTitle4>Tout s’est bien passé&nbsp;?</StyledTitle4>
      <StyledBody>
        Prends 5 minutes pour nous aider à améliorer l’expérience de réservation en répondant à ce
        court questionnaire.
      </StyledBody>
      <StyledButtonContainer>
        <ExternalTouchableLink
          as={Button}
          fullWidth
          wording="Répondre au questionnaire"
          externalNav={{
            url: `https://passculture.qualtrics.com/jfe/form/SV_9M3POmHFECvQCc6?userId=${userId}&offerId=${offerId}`,
          }}
        />
      </StyledButtonContainer>
    </AppModalWithIllustration>
  )
}

const StyledIllustration = styled(Bulb).attrs(({ theme }) => ({
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
