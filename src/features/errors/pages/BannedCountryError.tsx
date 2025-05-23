import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { pushFromRef } from 'features/navigation/navigationRef'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'

export const BannedCountryError = () => {
  const queryClient = useQueryClient()

  const onPress = () => {
    queryClient.clear()
    pushFromRef(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  }

  return (
    <GenericErrorPage
      illustration={BicolorBrokenConnection}
      title="Tu n’es pas en France&nbsp;?"
      subtitle="Pour des raisons de sécurité, l’usage du pass Culture est interdit dans certains pays ou en cas d’utilisation d’un VPN."
      buttonPrimary={{ wording: 'Réessayer', onPress }}
    />
  )
}
