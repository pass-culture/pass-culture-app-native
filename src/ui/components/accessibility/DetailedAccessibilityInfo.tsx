import React, { FC } from 'react'

import { ExternalAccessibilityDataModel, OfferAccessibilityResponse } from 'api/gen'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  url: string
  data: ExternalAccessibilityDataModel | null | undefined
}

export const DetailedAccessibilityInfo: FC<Props> = ({ url, data }) => {
  const accessibility: OfferAccessibilityResponse = {
    audioDisability: data?.isAccessibleAudioDisability,
    mentalDisability: data?.isAccessibleMentalDisability,
    motorDisability: data?.isAccessibleMotorDisability,
    visualDisability: data?.isAccessibleVisualDisability,
  }

  return (
    <React.Fragment>
      <BasicAccessibilityInfo accessibility={accessibility} />
      <Spacer.Column numberOfSpaces={6} />
      <InfoBanner message="Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.">
        <Spacer.Column numberOfSpaces={2} />
        <ExternalTouchableLink
          as={ButtonQuaternarySecondary}
          externalNav={{ url }}
          wording="Voir plus d’infos sur l’accessibilité du lieu"
          icon={ExternalSiteFilled}
          justifyContent="flex-start"
          inline
        />
      </InfoBanner>
    </React.Fragment>
  )
}
