import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSuspendForSuspiciousLoginMutation } from 'features/trustedDevice/queries/useSuspendForSuspiciousLoginMutation'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { UserError } from 'ui/svg/UserError'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const SuspensionChoice = () => {
  const { params } = useRoute<UseRouteType<'SuspensionChoice'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()
  const { logType } = useLogTypeFromRemoteConfig()

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
        if (logType === LogTypeEnum.INFO) {
          const errorMessage = getErrorMessage(error)
          eventMonitoring.captureException(
            `Can’t suspend account for suspicious login ; reason: "${errorMessage}"`,
            { level: logType, extra: { error } }
          )
        }
      },
    })

  const onPressContinue = useCallback(() => {
    suspendAccountForSuspiciousLogin({ token: params.token })
  }, [params.token, suspendAccountForSuspiciousLogin])

  const onPressContactFraudTeam = () => {
    analytics.logContactFraudTeam({ from: 'suspensionchoice' })
  }

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserError}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      buttonPrimary={{
        wording: 'Oui, suspendre mon compte',
        onPress: onPressContinue,
        isLoading,
      }}
      buttonTertiary={{
        icon: EmailFilled,
        wording: 'Contacter le service fraude',
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
              icon={ExternalSiteFilled}
              externalNav={{ url: env.CGU_LINK }}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau." />
        <BulletListItem text="tu n’auras plus accès au catalogue." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.BodyAccent>Les données que nous conservons&nbsp;:</Typo.BodyAccent>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
    </GenericInfoPage>
  )
}

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.default,
}))``
