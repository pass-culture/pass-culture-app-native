import React from 'react'
import { useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { UserProfileResponse } from 'api/gen'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutationV2 } from 'features/profile/helpers/useChangeEmailMutationV2'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { Info } from 'ui/svg/icons/Info'
import { Spacer } from 'ui/theme'

import { CenteredContainer, ButtonContainer } from './ChangeEmail'

export type FormValues = {
  currentEmail: string
}

export function ChangeEmailContent({
  hasCurrentEmailChange,
  user,
}: {
  hasCurrentEmailChange: boolean
  user: UserProfileResponse | undefined
}) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      currentEmail: user?.email,
    },
    mode: 'all',
    delayError: SUGGESTION_DELAY_IN_MS,
  })
  const { changeEmail, isLoading } = useChangeEmailMutationV2()

  const submitEmailChange = ({ currentEmail }: FormValues) => {
    changeEmail({ email: currentEmail })
  }
  const { bottom } = useSafeAreaInsets()

  const isSubmitButtonDisabled = !isValid || isLoading
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      {!!hasCurrentEmailChange && (
        <React.Fragment>
          <AlreadyChangedEmailDisclaimer />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <ChangeEmailDisclaimer />
      <Spacer.Column numberOfSpaces={4} />
      <CenteredContainer>
        <Form.MaxWidth flex={1}>
          <EmailInputController
            control={control}
            name="currentEmail"
            label="Adresse e-mail actuelle"
            disabled
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
              onPress={handleSubmit(submitEmailChange)}
              disabled={isSubmitButtonDisabled}
            />
          </ButtonContainer>
        </Form.MaxWidth>
        <Spacer.Column numberOfSpaces={6} />
      </CenteredContainer>
    </React.Fragment>
  )
}
