import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { HeadlineOffer } from 'features/headlineOffer/components/HeadlineOffer/HeadlineOffer'
import { HeadlineOfferData } from 'features/headlineOffer/type'
import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import type { VenueOffersArtists, VenueOffers as VenueOffersType } from 'features/venue/types'
import { Tab } from 'features/venue/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffersType
  playlists: GtlPlaylistData[]
  headlineOfferData?: HeadlineOfferData | null
  arePlaylistsLoading: boolean
  enableAccesLibre?: boolean
}

export const VenueBody: FunctionComponent<Props> = ({
  venue,
  venueArtists,
  venueOffers,
  playlists,
  headlineOfferData,
  arePlaylistsLoading,
  enableAccesLibre,
}) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const SectionContainer = isLargeScreen ? View : SectionWithDivider

  const handleOnBeforeNavigate = (headlineOfferData: HeadlineOfferData) => {
    triggerConsultOfferLog({
      offerId: Number(headlineOfferData.id),
      from: 'venue',
      venueId: venue.id,
      isHeadline: true,
    })
  }

  const tabPanels = {
    [Tab.OFFERS]: (
      <React.Fragment>
        {headlineOfferData ? (
          <MarginContainer gap={2}>
            <Typo.Title3 {...getHeadingAttrs(2)}>À la une</Typo.Title3>
            <HeadlineOffer
              navigateTo={{ screen: 'Offer', params: { id: headlineOfferData.id } }}
              {...headlineOfferData}
              onBeforeNavigate={() => handleOnBeforeNavigate(headlineOfferData)}
            />
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
          arePlaylistsLoading={arePlaylistsLoading}
        />
      </React.Fragment>
    ),
    [Tab.INFOS]: <PracticalInformation venue={venue} enableAccesLibre={enableAccesLibre} />,
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

const MarginContainer = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xxxl,
}))
