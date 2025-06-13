import React from 'react'
import { useQueryClient } from 'react-query'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { pushFromRef } from 'features/navigation/navigationRef'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'

export const BannedCountryError = () => {
  const queryClient = useQueryClient()

  const onPress = () => {
    queryClient.clear()
    pushFromRef(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  }

  return (
    <GenericErrorPage
      illustration={BrokenConnection}
      title="Tu n’es pas en France&nbsp;?"
      subtitle="Pour des raisons de sécurité, l’usage du pass Culture est interdit dans certains pays ou en cas d’utilisation d’un VPN."
      buttonPrimary={{ wording: 'Réessayer', onPress }}
    />
  )
}
