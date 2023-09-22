import * as React from 'react'
import styled from 'styled-components/native'

import { useResendEmailValidation } from 'features/auth/api/useResendEmailValidation'
import { analytics } from 'libs/analytics'
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
  const { mutate: resendEmail } = useResendEmailValidation({
    onError: () => {
      return
    },
  })

  const onResendPress = () => {
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
        <ButtonPrimary wording="Demander un nouveau lien" onPress={onResendPress} />
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
