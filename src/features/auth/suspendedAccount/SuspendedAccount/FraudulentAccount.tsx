import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { PageNotFound } from 'features/navigation/PageNotFound'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { styledButton } from 'ui/components/buttons/styledButton'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Touchable } from 'ui/components/touchable/Touchable'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const FraudulentAccount = () => {
  const { goBack, canGoBack } = useGoBack(...homeNavConfig)
  const { top } = useCustomSafeInsets()
  const { data: settings } = useAppSettings()

  useFocusEffect(
    useCallback(() => {
      if (!settings?.allowAccountReactivation) {
        navigateToHome()
      }
    }, [settings])
  )

  return settings?.allowAccountReactivation ? (
    <GenericInfoPage
      header={
        !!canGoBack() && (
          <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="Revenir en arrière">
            <StyledArrowPrevious />
          </HeaderContainer>
        )
      }
      title={t`Ton compte a été suspendu`}
      icon={UserBlocked}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`Contacter le support`}
          accessibilityLabel={t`Ouvrir le gestionnaire mail pour contacter le support`}
          externalNav={contactSupport.forGenericQuestion}
          icon={Email}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
          icon={PlainArrowPrevious}
        />,
      ]}>
      <StyledBody>{t`En raison d’une activité suspiscieuse, notre équipe anti fraude a suspendu ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Si tu souhaites revoir cette décision, tu peux contacter le support.`}
      </StyledBody>
    </GenericInfoPage>
  ) : (
    <PageNotFound />
  )
}

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
  accessibilityLabel: t`Revenir en arrière`,
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ top, theme }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
