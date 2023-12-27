import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { Spacer } from 'ui/theme'

export const VENUE_CTA_HEIGHT_IN_SPACES = 6 + 10 + 6

interface Props {
  venueId: number
}

export const VenueCTA: FunctionComponent<Props> = ({ venueId }) => {
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venueId)
  return (
    <StickyBottomWrapper>
      <BlurryWrapper>
        <CallToActionContainer>
          <Spacer.Column numberOfSpaces={6} />
          <InternalTouchableLink
            navigateTo={searchNavConfig}
            onBeforeNavigate={() => analytics.logVenueSeeAllOffersClicked(venueId)}
            as={ButtonPrimary}
            wording="Rechercher une offre"
            icon={SmallMagnifyingGlass}
            fullWidth
          />
          <Spacer.Column numberOfSpaces={6} />
        </CallToActionContainer>
        <Spacer.BottomScreen />
      </BlurryWrapper>
    </StickyBottomWrapper>
  )
}

const SmallMagnifyingGlass = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const CallToActionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  ...(!theme.isMobileViewport && {
    width: '100%',
    maxWidth: theme.contentPage.maxWidth,
  }),
}))
