import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSuspendForSuspiciousLoginMutation } from 'features/trustedDevice/queries/useSuspendForSuspiciousLoginMutation'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { UserError } from 'ui/svg/UserError'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const SuspensionChoice = () => {
  const { params } = useRoute<UseRouteType<'SuspensionChoice'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { logType } = useLogTypeFromRemoteConfig()

  const { mutate: suspendAccountForSuspiciousLogin, isPending } =
    useSuspendForSuspiciousLoginMutation({
      onSuccess: () => {
        navigate('SuspiciousLoginSuspendedAccount')
      },
      onError: (error) => {
        showErrorSnackBar(
          'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.'
        )
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

  const groupLabel = 'Les conséquences'

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserError}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      buttonPrimary={{
        wording: 'Oui, suspendre mon compte',
        onPress: onPressContinue,
        isLoading: isPending,
      }}
      buttonTertiary={{
        icon: EmailFilled,
        wording: 'Contacter le service fraude',
        onBeforeNavigate: onPressContactFraudTeam,
        externalNav: { url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` },
      }}>
      <Typo.BodyAccent>{groupLabel}&nbsp;:</Typo.BodyAccent>
      <VerticalUl>
        <BulletListItem
          groupLabel={groupLabel}
          index={0}
          total={3}
          accessibilityRole={AccessibilityRole.LINK}>
          <Typo.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les{SPACE}
            <ExternalTouchableLink
              as={LinkInsideTextBlack}
              wording="conditions générales d’utilisation"
              externalNav={{ url: env.CGU_LINK }}
              accessibilityRole={AccessibilityRole.LINK}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem
          index={1}
          total={3}
          groupLabel={groupLabel}
          text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau."
        />
        <BulletListItem
          index={2}
          total={3}
          groupLabel={groupLabel}
          text="tu n’auras plus accès au catalogue."
        />
      </VerticalUl>
      <StyledBodyAccent>Les données que nous conservons&nbsp;:</StyledBodyAccent>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
    </GenericInfoPage>
  )
}

const LinkInsideTextBlack = styled(LinkInsideText).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
