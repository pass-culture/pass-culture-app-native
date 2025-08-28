import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/helpers/useChangeEmailMutation'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing } from 'ui/theme'

export function ChangeEmailContent({
  hasCurrentEmailChange,
  user,
}: {
  hasCurrentEmailChange: boolean
  user: UserProfileResponseWithoutSurvey | undefined
}) {
  const { changeEmail, isLoading } = useChangeEmailMutation()

  const submitEmailChange = () => {
    if (user?.email) {
      changeEmail()
    }
  }
  const { bottom } = useSafeAreaInsets()

  const isSubmitButtonDisabled = !user?.email || isLoading
  return (
    <Container>
      {hasCurrentEmailChange ? (
        <DisclaimerContainer>
          <AlreadyChangedEmailDisclaimer />
        </DisclaimerContainer>
      ) : null}
      <DisclaimerContainer>
        <ChangeEmailDisclaimer />
      </DisclaimerContainer>
      <CenteredContainer>
        <Form.MaxWidth flex={1}>
          <EmailInput
            label="Adresse e-mail actuelle"
            disabled
            email={user?.email ?? ''}
            onEmailChange={() => undefined}
          />
          <InfoBannerContainer>
            <InfoBanner
              icon={Info}
              message="Tu vas recevoir un lien de confirmation sur ton adresse e-mail actuelle. Ce lien est valable 24h."
            />
          </InfoBannerContainer>
          <ButtonContainer paddingBottom={bottom}>
            <ButtonPrimary
              wording="Envoyer la demande"
              accessibilityLabel="Valider la demande de modification de mon e-mail"
              onPress={submitEmailChange}
              disabled={isSubmitButtonDisabled}
            />
          </ButtonContainer>
        </Form.MaxWidth>
      </CenteredContainer>
    </Container>
  )
}

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))

const DisclaimerContainer = styled.View({ marginBottom: getSpacing(4) })

const InfoBannerContainer = styled.View({ marginTop: getSpacing(4), marginBottom: getSpacing(12) })

const Container = styled.View({ marginTop: getSpacing(6) })
