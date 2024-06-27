import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSuspendForSuspiciousLoginMutation } from 'features/trustedDevice/helpers/useSuspendForSuspiciousLoginMutation'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { eventMonitoring } from 'libs/monitoring'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const SuspensionChoice = () => {
  const { params } = useRoute<UseRouteType<'SuspensionChoice'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()
  const { shouldLogInfo } = useRemoteConfigContext()

  const { mutate: suspendAccountForSuspiciousLogin, isLoading } =
    useSuspendForSuspiciousLoginMutation({
      onSuccess: () => {
        navigate('SuspiciousLoginSuspendedAccount')
      },
      onError: (error) => {
        showErrorSnackBar({
          message:
            'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.',
          timeout: SNACK_BAR_TIME_OUT,
        })
        if (shouldLogInfo)
          eventMonitoring.captureException(
            `Can’t suspend account for suspicious login ; reason: "${
              error instanceof Error ? error.message : undefined
            }"`,
            { level: 'info' }
          )
      },
    })

  const onPressContinue = useCallback(() => {
    suspendAccountForSuspiciousLogin({ token: params.token })
  }, [params.token, suspendAccountForSuspiciousLogin])

  return (
    <GenericInfoPageWhite
      headerGoBack
      titleComponent={Typo.Title3}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      separateIconFromTitle={false}
      icon={BicolorUserError}>
      <Typo.ButtonText>Les conséquences&nbsp;:</Typo.ButtonText>
      <VerticalUl>
        <BulletListItem>
          <Typo.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les{SPACE}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="conditions générales d’utilisation"
              icon={ExternalSiteFilled}
              externalNav={{ url: env.CGU_LINK }}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau." />
        <BulletListItem text="tu n’auras plus accès au catalogue." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.ButtonText>Les données que nous conservons&nbsp;:</Typo.ButtonText>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Oui, suspendre mon compte"
          onPress={onPressContinue}
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
    </GenericInfoPageWhite>
  )
}

const onPressContactFraudTeam = () => {
  analytics.logContactFraudTeam({ from: 'suspensionchoice' })
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
