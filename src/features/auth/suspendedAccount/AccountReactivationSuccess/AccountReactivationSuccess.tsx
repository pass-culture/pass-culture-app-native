import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const AccountReactivationSuccess = () => {
  const { data: settings } = useAppSettings()

  useFocusEffect(
    useCallback(() => {
      if (!settings?.allowAccountUnsuspension) {
        navigateToHome()
      }
    }, [settings])
  )

  return settings?.allowAccountUnsuspension ? (
    <GenericInfoPageWhite
      fullWidth
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      titleComponent={Typo.Title1}
      title={t`Ton compte a été réactivé`}>
      <TextContent>{t`On est ravi de te revoir\u00a0!\n Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.`}</TextContent>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <TouchableLink
          as={ButtonPrimary}
          wording={t`Découvrir le catalogue`}
          navigateTo={navigateToHomeConfig}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  ) : (
    <PageNotFound />
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const TextContent = styled(Typo.Body)({
  textAlign: 'center',
})
