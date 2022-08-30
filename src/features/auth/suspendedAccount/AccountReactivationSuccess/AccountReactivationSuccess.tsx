import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const AccountReactivationSuccess = () => (
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
        navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
      />
    </ButtonContainer>
  </GenericInfoPageWhite>
)

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const TextContent = styled(Typo.Body)({
  textAlign: 'center',
})
