import React, { FC } from 'react'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  url: string
}

export const DetailedAccessibilityInfo: FC<Props> = ({ url }) => {
  return (
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
  )
}
