import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useVenueOffersSearchNavigateTo } from 'features/venue/helpers/useVenueOffersSearchNavigateTo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  venueId: number
}

export const VenueCTA: FunctionComponent<Props> = ({ venueId }) => {
  const searchNavConfig = useVenueOffersSearchNavigateTo(venueId)
  return (
    <React.Fragment>
      <CallToActionContainer testID="CTA-button">
        <InternalTouchableLink
          navigateTo={searchNavConfig}
          as={ButtonPrimary}
          wording="Rechercher une offre"
          icon={SmallMagnyfinGlass}
          fullWidth
        />
        <Spacer.Column numberOfSpaces={6} />
      </CallToActionContainer>
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const SmallMagnyfinGlass = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
  alignItems: 'center',
})
