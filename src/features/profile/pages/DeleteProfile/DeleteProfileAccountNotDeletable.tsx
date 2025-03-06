import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment/env'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, TypoDS } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const DeleteProfileAccountNotDeletable: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getProfileStackConfig('Profile'))

  const navigateToNotifications = () => navigate('NotificationsSettings')
  const { illustrations } = useTheme()

  return (
    <GenericInfoPageWhite
      headerGoBack
      separateIconFromTitle={false}
      icon={BicolorError}
      iconSize={illustrations.sizes.medium}
      titleComponent={TypoDS.Title2}
      title="Nous ne pouvons pas encore supprimer ton compte">
      <Content>
        <ViewGap gap={6}>
          <TypoDS.BodyS>
            Pour éviter les cas de fraude et te permettre d’accéder à ton crédit, il est nécessaire
            de garder ton compte pour l’instant.
          </TypoDS.BodyS>
          <TypoDS.BodyS>
            À tes 21 ans, ton compte pourra être supprimé et tu pourras faire une demande pour
            anonymiser tes données. Tu peux en savoir plus en{SPACE}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="consultant cette page."
              icon={ExternalSiteFilled}
              externalNav={{ url: env.FAQ_LINK_RIGHT_TO_ERASURE }}
            />
          </TypoDS.BodyS>
          <TypoDS.BodyS>
            Pour ne plus recevoir de communications du pass Culture, tu peux désactiver tes
            notifications
          </TypoDS.BodyS>
        </ViewGap>

        <ContentBottom>
          <ButtonPrimary wording="Retourner sur mon profil" onPress={navigateToProfile} />
          <ButtonTertiaryBlack
            wording="Désactiver mes notifications"
            onPress={navigateToNotifications}
            icon={BellFilled}
          />
        </ContentBottom>
      </Content>
    </GenericInfoPageWhite>
  )
}

const Content = styled(ViewGap).attrs({
  gap: 6,
})({
  marginTop: getSpacing(4),
})

const ContentBottom = styled(ViewGap).attrs({
  gap: 6,
})({
  alignItems: 'center',
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
