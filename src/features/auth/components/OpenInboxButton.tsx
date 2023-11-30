import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const OpenInboxButton = ({ onAdditionalPress }: { onAdditionalPress?: () => void }) => {
  const { showErrorSnackBar } = useSnackBarContext()

  const onPress = async () => {
    try {
      await openInbox()
      onAdditionalPress?.()
    } catch (error) {
      showErrorSnackBar({
        message:
          'Nous n’avons pas réussi à ouvrir votre boîte e-mail. Veuillez l’ouvrir manuellement.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  return <ButtonPrimary wording="Consulter mes e-mails" onPress={onPress} icon={EmailFilled} />
}
