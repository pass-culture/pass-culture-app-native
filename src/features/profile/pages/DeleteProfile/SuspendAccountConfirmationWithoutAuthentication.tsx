import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useAccountSuspendForHackSuspicionMutation } from 'features/auth/queries/useAccountSuspendForHackSuspicionMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideTextV2 } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextV2'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { UserError } from 'ui/svg/UserError'
import { getSpacing, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const SuspendAccountConfirmationWithoutAuthentication: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const onPressContactFraudTeam = () => {
    analytics.logContactFraudTeam({ from: 'suspendaccountconfirmation' })
  }

  const { accountSuspendForHackSuspicion, isLoading } = useAccountSuspendForHackSuspicionMutation({
    onSuccess: () => {
      navigate('SuspiciousLoginSuspendedAccount')
    },
    onError: () => {
      showErrorSnackBar({
        message:
          'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserError}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      buttonPrimary={{
        wording: 'Oui, suspendre mon compte',
        onPress: accountSuspendForHackSuspicion,
        isLoading,
      }}
      buttonTertiary={{
        wording: 'Contacter le service fraude',
        icon: EmailFilled,
        onBeforeNavigate: onPressContactFraudTeam,
        externalNav: { url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` },
      }}>
      <Typo.BodyAccent>Les conséquences&nbsp;:</Typo.BodyAccent>
      <VerticalUl>
        <BulletListItem>
          <Typo.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les{SPACE}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="conditions générales d’utilisation"
              externalNav={{ url: env.CGU_LINK }}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau." />
        <BulletListItem text="tu n’auras plus accès au catalogue." />
      </VerticalUl>
      <StyledBodyAccent>Les données que nous conservons&nbsp;:</StyledBodyAccent>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
    </GenericInfoPage>
  )
}

const StyledButtonInsideText = styled(ButtonInsideTextV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``

const StyledBodyAccent = styled(Typo.BodyAccent)({
  marginTop: getSpacing(4),
})
