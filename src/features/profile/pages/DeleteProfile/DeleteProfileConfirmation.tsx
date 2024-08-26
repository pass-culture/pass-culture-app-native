import React from 'react'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { env } from 'libs/environment'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorProfileDeletion } from 'ui/svg/icons/BicolorProfileDeletion'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

export const DeleteProfileConfirmation = () => (
  <GenericInfoPageWhite
    headerGoBack
    goBackParams={getTabNavConfig('Profile')}
    icon={BicolorProfileDeletion}
    separateIconFromTitle={false}
    title="Ta demande de suppression de compte"
    titleComponent={Typo.Title2}>
    <Typo.Body>
      Si tu confirmes ta demande, l’accès à ton compte sera supprimé et nous anonymiserons tes
      données personnelles.
    </Typo.Body>
    <Spacer.Column numberOfSpaces={6} />
    <InfoBanner message="L’anonymisation de tes données personnelles empêche toute possibilité de te réidentifier à l’avenir.">
      <Spacer.Column numberOfSpaces={2} />
      <ExternalTouchableLink
        as={ButtonQuaternarySecondary}
        externalNav={{ url: env.FAQ_LINK_PERSONAL_DATA }}
        wording="Voir la charte des données personnelles"
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
        inline
      />
    </InfoBanner>
    <Spacer.Column numberOfSpaces={6} />
    <ButtonPrimary wording="Supprimer mon compte" onPress={() => 'PC-XXXXX'} />
    <Spacer.Column numberOfSpaces={4} />
    <InternalTouchableLink
      as={ButtonTertiaryBlack}
      wording="Annuler"
      navigateTo={{ screen: 'DeleteProfileReason' }}
      icon={Invalidate}
    />
  </GenericInfoPageWhite>
)
