import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useAccountSuspendForHackSuspicionMutation } from 'features/auth/queries/useAccountSuspendForHackSuspicionMutation'
import { resetFromRef } from 'features/navigation/navigationRef'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Adjust } from 'libs/adjust/adjust'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { Link } from 'ui/designSystem/Link/Link'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { useVersion } from 'ui/hooks/useVersion'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { UserError } from 'ui/svg/UserError'
import { Typo } from 'ui/theme'

export const SuspendAccountConfirmationWithoutAuthentication: FC = () => {
  const signOut = useLogoutRoutine()
  const { user } = useAuthContext()
  const version = useVersion()
  const metrics = useDeviceMetrics()

  const onPressContactFraudTeam = () => {
    analytics.logContactFraudTeam({ from: 'suspendaccountconfirmation' })
  }

  const { accountSuspendForHackSuspicion, isLoading } = useAccountSuspendForHackSuspicionMutation({
    onSuccess: async () => {
      await signOut()
      // We use resetFromRef instead of navigation because signOut() may unmount the current screen
      // (RootNavigator rebuild). resetFromRef ensures navigation still works after logout.
      resetFromRef('SuspiciousLoginSuspendedAccount')
    },
    onError: () => {
      showErrorSnackBar(
        'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.'
      )
    },
  })

  const groupLabel = 'Les conséquences'

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserError}
      remoteIllustration={{
        url: remoteIllustrationUrls.cryingManPaintingLarge,
        backgroundColor: 'negative01',
      }}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      buttonPrimary={{
        wording: 'Oui, suspendre mon compte',
        onPress: () => {
          Adjust.gdprForgetMe()
          accountSuspendForHackSuspicion()
        },
        isLoading,
      }}
      buttonTertiary={{
        wording: 'Contacter le service fraude',
        icon: EmailFilled,
        onBeforeNavigate: onPressContactFraudTeam,
        externalNav: { url: buildZendeskUrlForFraud({ user, metrics, version }) },
      }}>
      <Typo.BodyAccent>{groupLabel}&nbsp;:</Typo.BodyAccent>
      <VerticalUl>
        <BulletListItem
          groupLabel={groupLabel}
          index={0}
          total={3}
          accessibilityRole={AccessibilityRole.LINK}>
          <Typo.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les&nbsp;
            <ExternalTouchableLink
              as={Link}
              isInsideText
              color="neutral"
              wording="conditions générales d’utilisation"
              externalNav={{ url: env.CGU_LINK }}
              accessibilityRole={AccessibilityRole.LINK}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem
          groupLabel={groupLabel}
          index={1}
          total={3}
          text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau."
        />
        <BulletListItem
          groupLabel={groupLabel}
          index={2}
          total={3}
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

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
