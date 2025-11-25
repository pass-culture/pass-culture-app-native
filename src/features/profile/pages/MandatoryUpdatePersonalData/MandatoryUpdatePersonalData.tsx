import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { env } from 'libs/environment/env'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { UserError } from 'ui/svg/UserError'
import { LINE_BREAK } from 'ui/theme/constants'

export const MandatoryUpdatePersonalData = () => (
  <GenericInfoPage
    illustration={UserError}
    title="Mets à jour ton profil"
    subtitle={`Pour mieux t’accompagner, on a besoin de vérifier que tes informations personnelles sont toujours à jour.${LINE_BREAK}C’est rapide, promis.`}
    buttonPrimary={{
      wording: 'Commencer',
      navigateTo: getProfilePropConfig('ProfileInformationValidationUpdate'),
    }}>
    <ExternalTouchableLink
      as={ButtonTertiaryBlack}
      wording="Charte des données personnelles"
      externalNav={{ url: env.PRIVACY_POLICY_LINK }}
      icon={ExternalSiteFilled}
      numberOfLines={2}
    />
  </GenericInfoPage>
)
