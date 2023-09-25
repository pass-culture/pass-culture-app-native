import * as React from 'react'
import styled from 'styled-components/native'

import { ApiError } from 'api/apiHelpers'
import { useResendEmailValidation } from 'features/auth/api/useResendEmailValidation'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
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

  const { mutate: resendEmail, isLoading } = useResendEmailValidation({ onError })

  const onResendPress = () => {
    setErrorMessage(undefined)
    resendEmail({ email })
    analytics.logResendEmailValidation()
  }

  return (
    <AppModal
      visible={visible}
      title="Recevoir un nouveau lien"
      rightIcon={Close}
      onRightIconPress={onDismiss}
      rightIconAccessibilityLabel="Fermer la modale">
      <ModalContent>
        <StyledBody>
          Si après 5 minutes tu n’as pas reçu ton lien de validation par e-mail, tu peux en demander
          un nouveau.
        </StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Demander un nouveau lien"
          onPress={onResendPress}
          disabled={isLoading}
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
