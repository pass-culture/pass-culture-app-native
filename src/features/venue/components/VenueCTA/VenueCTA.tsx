import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

export const VENUE_CTA_HEIGHT_IN_SPACES = 6 + 10 + 6

interface Props {
  venue: VenueResponse
}

export const VenueCTA: FunctionComponent<Props> = ({ venue }) => {
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)
  return (
    <StickyBottomWrapper>
      <CallToActionContainer>
        <Spacer.Column numberOfSpaces={6} />
        <InternalTouchableLink
          navigateTo={searchNavConfig}
          onBeforeNavigate={() => analytics.logVenueSeeAllOffersClicked(venue.id)}
          as={ButtonPrimary}
          wording="Rechercher une offre"
          icon={SmallMagnifyingGlass}
          fullWidth
        />
        <Spacer.Column numberOfSpaces={6} />
      </CallToActionContainer>
      <Spacer.BottomScreen />
    </StickyBottomWrapper>
  )
}

const SmallMagnifyingGlass = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  ...(!theme.isMobileViewport && {
    maxWidth: theme.contentPage.maxWidth,
  }),
}))
