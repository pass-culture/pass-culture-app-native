import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useAccountSuspendForHackSuspicionMutation } from 'features/auth/queries/useAccountSuspendForHackSuspicionMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
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
    <GenericInfoPageWhiteLegacy
      headerGoBack
      titleComponent={TypoDS.Title3}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      separateIconFromTitle={false}
      icon={BicolorUserError}>
      <TypoDS.BodyAccent>Les conséquences&nbsp;:</TypoDS.BodyAccent>
      <VerticalUl>
        <BulletListItem>
          <TypoDS.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les{SPACE}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="conditions générales d’utilisation"
              icon={ExternalSiteFilled}
              externalNav={{ url: env.CGU_LINK }}
            />
          </TypoDS.Body>
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau." />
        <BulletListItem text="tu n’auras plus accès au catalogue." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.BodyAccent>Les données que nous conservons&nbsp;:</TypoDS.BodyAccent>
      <TypoDS.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </TypoDS.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Oui, suspendre mon compte"
          onPress={accountSuspendForHackSuspicion}
          isLoading={isLoading}
        />
        <Spacer.Column numberOfSpaces={2} />
        <ExternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Contacter le service fraude"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le service fraude"
          icon={EmailFilled}
          onBeforeNavigate={onPressContactFraudTeam}
          externalNav={{ url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` }}
        />
      </ButtonContainer>
    </GenericInfoPageWhiteLegacy>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
