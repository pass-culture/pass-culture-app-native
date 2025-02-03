import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { offerToHeadlineOfferData } from 'features/headlineOffer/adapters/offerToHeadlineOfferData'
import { HeadlineOffer } from 'features/headlineOffer/components/HeadlineOffer/HeadlineOffer'
import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import type { VenueOffersArtists, VenueOffers as VenueOffersType } from 'features/venue/types'
import { Tab } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { offersFixture } from 'shared/offer/offer.fixture'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffersType
  playlists?: GtlPlaylistData[]
}

export const VenueBody: FunctionComponent<Props> = ({
  venue,
  venueArtists,
  venueOffers,
  playlists,
}) => {
  const { userLocation } = useLocation()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const SectionContainer = isLargeScreen ? View : SectionWithDivider

  const headlineData = offerToHeadlineOfferData({
    // Fake data to remove
    offer: offersFixture[0],
    transformParameters: {
      currency,
      euroToPacificFrancRate,
      mapping,
      labelMapping,
      userLocation,
    },
  })

  const tabPanels = {
    [Tab.OFFERS]: (
      <React.Fragment>
        {headlineData ? (
          <MarginContainer gap={2}>
            <TypoDS.Title3 {...getHeadingAttrs(2)}>À la une</TypoDS.Title3>
            <HeadlineOffer {...headlineData} />
          </MarginContainer>
        ) : null}
        <VenueOffers
          venue={venue}
          venueArtists={venueArtists}
          venueOffers={venueOffers}
          playlists={playlists}
          mapping={mapping}
          labelMapping={labelMapping}
          currency={currency}
          euroToPacificFrancRate={euroToPacificFrancRate}
        />
      </React.Fragment>
    ),
    [Tab.INFOS]: <PracticalInformation venue={venue} />,
  }

  return (
    <SectionContainer visible gap={6}>
      <TabLayout
        tabPanels={tabPanels}
        tabs={[{ key: Tab.OFFERS }, { key: Tab.INFOS }]}
        defaultTab={Tab.OFFERS}
        onTabChange={{
          'Offres disponibles': () =>
            analytics.logConsultVenueOffers({
              venueId: venue.id,
            }),
          'Infos pratiques': () =>
            analytics.logConsultPracticalInformations({
              venueId: venue.id,
            }),
        }}
      />
    </SectionContainer>
  )
}

const MarginContainer = styled(ViewGap)({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(10),
})
