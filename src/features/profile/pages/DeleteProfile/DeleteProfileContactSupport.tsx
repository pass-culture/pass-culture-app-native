import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/profileStackHelpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { TypoDS } from 'ui/theme'

import { nativeEmailProvider } from './EmailProvider'
import { useContactSupportForDeletionProfile } from './useContactSupportForDeletionProfile'
import { webEmailProvider } from './WebEmailProvider.web'

const isWeb = Platform.OS === 'web'

export const DeleteProfileContactSupport: FC = () => {
  const emailProvider = isWeb ? webEmailProvider() : nativeEmailProvider()
  const { requestSendMail } = useContactSupportForDeletionProfile({ emailProvider })
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getProfileStackConfig('Profile'))
  return (
    <GenericInfoPageWhite
      headerGoBack
      separateIconFromTitle={false}
      icon={BicolorEmailSent}
      titleComponent={TypoDS.Title2}
      title="Contacte le support">
      <ViewGap gap={8}>
        <ViewGap gap={6}>
          <TypoDS.Body>
            Pour traiter ta demande, nous te conseillons d’écrire à notre équipe support.
          </TypoDS.Body>
          <TypoDS.Body>
            Ta demande sera analysée et tu pourras être redirigé vers la meilleure solution.
          </TypoDS.Body>
        </ViewGap>

        <ContentBottom>
          <ButtonPrimary icon={Email} wording="Contacter le support" onPress={requestSendMail} />
          <ButtonTertiaryBlack
            wording="Retourner au profil"
            onPress={navigateToProfile}
            icon={PlainArrowNext}
          />
        </ContentBottom>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}

const ContentBottom = styled(ViewGap).attrs({
  gap: 6,
})({
  alignItems: 'center',
})
