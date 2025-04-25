import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/helpers/useChangeEmailMutation'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { Info } from 'ui/svg/icons/Info'
import { Spacer } from 'ui/theme'

export function ChangeEmailContent({
  hasCurrentEmailChange,
  user,
}: {
  hasCurrentEmailChange: boolean
  user: UserProfileResponse | undefined
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
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      {hasCurrentEmailChange ? (
        <React.Fragment>
          <AlreadyChangedEmailDisclaimer />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}
      <ChangeEmailDisclaimer />
      <Spacer.Column numberOfSpaces={4} />
      <CenteredContainer>
        <Form.MaxWidth flex={1}>
          <EmailInput
            label="Adresse e-mail actuelle"
            disabled
            email={user?.email ?? ''}
            onEmailChange={() => undefined}
          />
          <Spacer.Column numberOfSpaces={4} />
          <InfoBanner
            icon={Info}
            message="Tu vas recevoir un lien de confirmation sur ton adresse e-mail actuelle. Ce lien est valable 24h."
          />
          <Spacer.Column numberOfSpaces={12} />
          <ButtonContainer paddingBottom={bottom}>
            <ButtonPrimary
              wording="Envoyer la demande"
              accessibilityLabel="Valider la demande de modification de mon e-mail"
              onPress={submitEmailChange}
              disabled={isSubmitButtonDisabled}
            />
          </ButtonContainer>
        </Form.MaxWidth>
        <Spacer.Column numberOfSpaces={6} />
      </CenteredContainer>
    </React.Fragment>
  )
}

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
