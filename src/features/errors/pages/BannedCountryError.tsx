import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { pushFromRef } from 'features/navigation/navigationRef'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericErrorPage } from 'ui/components/GenericErrorPage'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BannedCountryError = () => {
  const queryClient = useQueryClient()

  const onPress = () => {
    queryClient.clear()
    pushFromRef(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  }

  return (
    <GenericErrorPage
      noBackground
      title="Tu n’es pas en France&nbsp;?"
      icon={BicolorBrokenConnection}
      buttons={[
        <ButtonPrimary key={1} buttonHeight="tall" wording="Réessayer" onPress={onPress} />,
      ]}>
      <StyledBody>
        Pour des raisons de sécurité, l’usage du pass Culture est interdit dans certains pays ou en
        cas d’utilisation d’un VPN.
      </StyledBody>
    </GenericErrorPage>
  )
}

const StyledBody = styled(Typo.Body).attrs(() => getHeadingAttrs(2))({
  textAlign: 'center',
})
