import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { EmailAttemptsLeft } from 'features/auth/pages/signup/SignupConfirmationEmailSent/EmailAttemptsLeft'
import { useEmailValidationRemainingResendsQuery } from 'features/auth/queries/useEmailValidationRemainingResendQuery'
import { useResendEmailValidationMutation } from 'features/auth/queries/useResendEmailValidationMutation'
import { analytics } from 'libs/analytics/provider'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { useTimer } from 'libs/hooks/useTimer'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { formatToHour } from 'libs/parsers/formatDates'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  email: string
  visible: boolean
  onDismiss: () => void
}

const handleError = (error: ApiError, logType: LogTypeEnum) => {
  if (logType === LogTypeEnum.INFO)
    eventMonitoring.captureException(
      `Could not resend validation email: ${String(error.content)}`,
      {
        level: logType,
      }
    )
  return error.statusCode === 429
    ? 'Tu as dépassé le nombre de renvois autorisés.'
    : 'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
}

export const EmailResendModal = ({ email, visible, onDismiss }: Props) => {
  const [errorMessage, setErrorMessage] = React.useState<string>()
  const { timeLeft, setTimeLeft } = useTimer(0)
  const { logType } = useLogTypeFromRemoteConfig()

  const onError = (error: ApiError) => setErrorMessage(handleError(error, logType))

  const {
    data: remainingResendsResponse,
    refetch: refetchRemainingResends,
    isError,
    error,
  } = useEmailValidationRemainingResendsQuery({
    email,
  })

  useEffect(() => {
    if (isError) {
      setErrorMessage(handleError(error, logType))
    }
  }, [isError, error, logType])

  const onResendEmailSuccess = () => {
    refetchRemainingResends()
    setTimeLeft(60)
  }
  const { mutate: resendEmail, isPending } = useResendEmailValidationMutation({
    onError,
    onSuccess: onResendEmailSuccess,
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

  const isResendCooldownActive = timeLeft > 0

  const resendAttemptText = isResendCooldownActive
    ? `Nous t’avons envoyé un nouveau lien. Une autre demande sera possible dans ${timeLeft}s.`
    : 'Si après 5 minutes tu n’as pas reçu ton lien de validation par e-mail, tu peux en demander un nouveau.'

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
            <StyledBody>{resendAttemptText}</StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <EmailAttemptsLeft attemptsLeft={remainingResendsResponse?.remainingResends} />
            <Spacer.Column numberOfSpaces={2} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Banner
              type={BannerType.ALERT}
              label={`Tu as dépassé le nombre de 3 demandes de lien autorisées.${retryMessage}`}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        )}
        <ButtonPrimary
          wording="Demander un nouveau lien"
          onPress={onResendPress}
          disabled={isPending || !hasAttemptsLeft || isResendCooldownActive}
        />
        {errorMessage ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <StyledCaption>{errorMessage}</StyledCaption>
          </React.Fragment>
        ) : null}
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

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
  textAlign: 'center',
}))
