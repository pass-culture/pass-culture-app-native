import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
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
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const SuspendedAccount = () => {
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
      title={t`Ton compte est désactivé`}
      icon={ProfileDeletionIllustration}
      buttons={[
        <ButtonPrimaryWhite key={1} wording={t`Réactiver mon compte`} />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording={t`Retourner à l'accueil`}
          navigateTo={navigateToHomeConfig}
          icon={PlainArrowPrevious}
        />,
      ]}>
      <StyledBody>{t`Tu as jusqu'au xxxx pour réactiver ton compte.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Une fois cette date passée, ton compte pass Culture sera définitivement supprimé.`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>
        {t`Pour réactiver ton compte nous allons te demander de réinitialiser ton mot de passe.`}
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
