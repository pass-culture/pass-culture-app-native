import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/queries/useChangeEmailMutation'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { Form } from 'ui/components/Form'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'

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
            <Banner label="Tu vas recevoir un lien de confirmation sur ton adresse e-mail actuelle. Ce lien est valable 24h." />
          </InfoBannerContainer>
          <ButtonContainer paddingBottom={bottom}>
            <Button
              variant="primary"
              fullWidth
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

const CenteredContainer = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))

const DisclaimerContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const InfoBannerContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxxxl,
}))

const Container = styled.View(({ theme }) => ({ marginTop: theme.designSystem.size.spacing.xl }))
