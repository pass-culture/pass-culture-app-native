import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const DeleteProfileAccountNotDeletable: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))
  const navigateToNotifications = () => navigate(...getProfileHookConfig('NotificationsSettings'))

  return (
    <GenericInfoPage
      withGoBack
      illustration={ErrorIllustration}
      title="Nous ne pouvons pas encore supprimer ton compte"
      buttonPrimary={{ wording: 'Retourner sur mon profil', onPress: navigateToProfile }}
      buttonTertiary={{
        wording: 'Désactiver mes notifications',
        onPress: navigateToNotifications,
        icon: BellFilled,
      }}>
      <ViewGap gap={6}>
        <Typo.BodyS>
          Pour éviter les cas de fraude et te permettre d’accéder à ton crédit, il est nécessaire de
          garder ton compte pour l’instant.
        </Typo.BodyS>
        <Typo.BodyS>
          À tes 21 ans, ton compte pourra être supprimé et tu pourras faire une demande pour
          anonymiser tes données. Tu peux en savoir plus en{SPACE}
          <ExternalTouchableLink
            as={LinkInsideTextBlack}
            wording="consultant cette page."
            externalNav={{ url: env.FAQ_LINK_RIGHT_TO_ERASURE }}
            accessibilityRole={AccessibilityRole.LINK}
          />
        </Typo.BodyS>
        <Typo.BodyS>
          Pour ne plus recevoir de communications du pass Culture, tu peux désactiver tes
          notifications
        </Typo.BodyS>
      </ViewGap>
    </GenericInfoPage>
  )
}

const LinkInsideTextBlack = styled(LinkInsideText).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``
