import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import { SetContainer } from 'features/auth/pages/signup/SetContainer'
import { EmailResendModal } from 'features/auth/pages/signup/SignupConfirmationEmailSent/EmailResendModal'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Again } from 'ui/svg/icons/Again'

export type Props = {
  email: string
}

export const faqConfig = {
  url: env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED,
  params: { shouldLogEvent: false },
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => {
  const { visible, showModal, hideModal } = useModal()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const additionalCTA = (
    <ButtonWrapper>
      <Button
        variant="tertiary"
        color="neutral"
        accessibilityRole={AccessibilityRole.BUTTON}
        wording="Recevoir un nouveau lien"
        onPress={showModal}
        icon={Again}
      />
    </ButtonWrapper>
  )

  return (
    <SetContainer>
      <EmailSentGeneric
        title="Confirme ton adresse e-mail"
        email={email}
        consultFaq={faqConfig}
        consultFaqAnalytics={analytics.logHelpCenterContactSignupConfirmationEmailSent}
        additionalCTA={additionalCTA}
        remoteIllustration={
          enableNewVisionUi
            ? { url: remoteIllustrationUrls.mailBoxSendingLarge, backgroundColor: 'positive01' }
            : undefined
        }
      />
      <EmailResendModal email={email} visible={visible} onDismiss={hideModal} />
    </SetContainer>
  )
}
const ButtonWrapper = styled.View({
  alignSelf: 'flex-start',
})
