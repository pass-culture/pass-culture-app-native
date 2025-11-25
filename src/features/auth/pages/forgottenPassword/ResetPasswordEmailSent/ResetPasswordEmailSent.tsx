import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import {
  RootStackParamList,
  StepperOrigin,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { env } from 'libs/environment/env'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

type Props = Pick<NativeStackScreenProps<RootStackParamList, 'ResetPasswordEmailSent'>, 'route'>

export const ResetPasswordEmailSent: FunctionComponent<Props> = ({ route }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const onClose = () => {
    navigate('Login', { from: StepperOrigin.RESET_PASSWORD_EMAIL_SENT })
  }

  return (
    <SecondaryPageWithBlurHeader
      title="Oubli de mot de passe"
      shouldDisplayBackButton={false}
      RightButton={<RightButtonText onClose={onClose} wording="Quitter" />}>
      <EmailSentGeneric
        title="Clique sur le lien de réinitialisation reçu par e-mail"
        consultFaq={{ url: env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED }}
        email={route.params.email}
      />
    </SecondaryPageWithBlurHeader>
  )
}
