import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { UserError } from 'ui/svg/UserError'

export const MandatoryUpdatePersonalData = () => (
  <GenericInfoPage
    illustration={UserError}
    title="Une petite mise à jour de tes informations personnelles&nbsp;?"
    subtitle="Avant de continuer, assure-toi que tes informations personnelles sont toujours correctes. C’est rapide, promis."
    buttonPrimary={{
      wording: 'Commencer',
      navigateTo: getProfilePropConfig('ProfileInformationValidationUpdate'),
    }}
  />
)
