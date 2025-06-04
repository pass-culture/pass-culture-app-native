import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { env } from 'libs/environment/env'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const DeleteProfileAccountNotDeletable: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))
  const navigateToNotifications = () => navigate(...getProfileStackConfig('NotificationsSettings'))

  return (
    <GenericInfoPage
      withGoBack
      illustration={BicolorError}
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
            as={StyledButtonInsideText}
            wording="consultant cette page."
            icon={ExternalSiteFilled}
            externalNav={{ url: env.FAQ_LINK_RIGHT_TO_ERASURE }}
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

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.default,
}))``
