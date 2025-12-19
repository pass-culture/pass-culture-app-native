import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailSent as InitialEmailSent } from 'ui/svg/icons/EmailSent'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'

export const DeleteProfileContactSupport: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))
  return (
    <GenericInfoPage
      withGoBack
      illustration={EmailSent}
      title="Contacte le support"
      buttonPrimary={{
        wording: 'Contacter le support',
        externalNav: { url: env.SUPPORT_ACCOUNT_ISSUES_FORM },
        onBeforeNavigate: () => analytics.logHasClickedContactForm('DeleteProfileContactSupport'),
      }}
      buttonTertiary={{
        wording: 'Retourner au profil',
        onPress: navigateToProfile,
        icon: PlainArrowNext,
      }}>
      <ViewGap gap={6}>
        <StyledBody>
          Pour traiter ta demande, nous te conseillons d’écrire à notre équipe support.
        </StyledBody>
        <StyledBody>
          Ta demande sera analysée et tu pourras être redirigé vers la meilleure solution.
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const EmailSent = styled(InitialEmailSent).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
