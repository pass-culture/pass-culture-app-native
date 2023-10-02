import * as React from 'react'
import styled from 'styled-components/native'

import { ApiError } from 'api/apiHelpers'
import { useEmailValidationRemainingResends } from 'features/auth/api/useEmailValidationRemainingResend'
import { useResendEmailValidation } from 'features/auth/api/useResendEmailValidation'
import { EmailAttemptsLeft } from 'features/auth/pages/signup/SignupConfirmationEmailSent/EmailAttemptsLeft'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { eventMonitoring } from 'libs/monitoring'
import { formatToHour } from 'libs/parsers'
import { AlertBanner } from 'ui/components/banners/AlertBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  email: string
  visible: boolean
  onDismiss: () => void
}

export const EmailResendModal = ({ email, visible, onDismiss }: Props) => {
  const [errorMessage, setErrorMessage] = React.useState<string>()

  const onError = (error: ApiError) => {
    if (error.statusCode === 429) {
      setErrorMessage('Tu as dépassé le nombre de renvois autorisés.')
    } else {
      setErrorMessage(
        'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
      )
    }
    eventMonitoring.captureMessage(`Could not resend validation email: ${error.content}`, 'info')
  }

  const { data: remainingResendsResponse, refetch: refetchRemainingResends } =
    useEmailValidationRemainingResends({
      email,
      onError,
    })
  const { mutate: resendEmail, isLoading } = useResendEmailValidation({
    onError,
    onSuccess: refetchRemainingResends,
  })

  const retryMessage = remainingResendsResponse?.counterResetDatetime
    ? ` Tu pourras réessayer le ${formatToSlashedFrenchDate(
        remainingResendsResponse?.counterResetDatetime
      )} à ${formatToHour(new Date(remainingResendsResponse?.counterResetDatetime))}.`
    : ''

  const onResendPress = () => {
    setErrorMessage(undefined)
    resendEmail({ email })
    analytics.logResendEmailValidation()
  }

  const hasAttemptsLeft =
    !!remainingResendsResponse?.remainingResends && remainingResendsResponse.remainingResends > 0

  return (
    <AppModal
      visible={visible}
      title="Recevoir un nouveau lien"
      rightIcon={Close}
      onRightIconPress={onDismiss}
      rightIconAccessibilityLabel="Fermer la modale">
      <ModalContent>
        {hasAttemptsLeft ? (
          <React.Fragment>
            <StyledBody>
              Si après 5 minutes tu n’as pas reçu ton lien de validation par e-mail, tu peux en
              demander un nouveau.
            </StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <EmailAttemptsLeft attemptsLeft={remainingResendsResponse?.remainingResends} />
            <Spacer.Column numberOfSpaces={2} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AlertBanner
              message={`Tu as dépassé le nombre de 3 demandes de lien autorisées.${retryMessage}`}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        )}
        <ButtonPrimary
          wording="Demander un nouveau lien"
          onPress={onResendPress}
          disabled={isLoading || !hasAttemptsLeft}
        />
        {!!errorMessage && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <StyledCaption>{errorMessage}</StyledCaption>
          </React.Fragment>
        )}
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.error,
  textAlign: 'center',
}))
