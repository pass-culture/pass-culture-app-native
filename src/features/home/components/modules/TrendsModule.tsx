import React, { useEffect } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { BookingsResponse, SubcategoryIdEnum } from 'api/gen'
import { OnGoingBookingItem } from 'features/bookings/components/OnGoingBookingItem'
import { Trend } from 'features/home/components/Trend'
import { TrendBlock, TrendNavigationProps } from 'features/home/types'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useSelectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Trends = {
  index: number
  moduleId: string
  homeEntryId: string
  items: TrendBlock[]
}

const bookingFixture: BookingsResponse['ongoing_bookings'][0] = {
  id: 123,
  cancellationDate: null,
  cancellationReason: null,
  confirmationDate: '2021-03-15T23:01:37.925926',
  dateCreated: '2021-02-15T23:01:37.925926',
  dateUsed: null,
  expirationDate: null,
  totalAmount: 1900,
  token: '352UW4',
  quantity: 2,
  qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
  stock: {
    id: 150230,
    beginningDatetime: '2021-03-15T20:00:00',
    price: 400,
    priceCategoryLabel: 'Cat 4',
    features: ['VOSTFR', '3D', 'IMAX'],
    offer: {
      id: 147874,
      bookingContact: null,
      name: 'Avez-vous déjà vu\u00a0?',
      extraData: {
        ean: '123456789',
      },
      isPermanent: false,
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
      venue: {
        id: 2185,
        city: 'Drancy',
        name: 'Maison de la Brique',
        coordinates: {
          latitude: 48.91683,
          longitude: 2.43884,
        },
        address: '1 boulevard de la brique',
        postalCode: '93700',
        timezone: 'Europe/Paris',
      },
      withdrawalDetails: null,
    },
  },
  externalBookings: [],
}

const isWeb = Platform.OS === 'web'

export const TrendsModule = ({ index, moduleId, homeEntryId, items }: Trends) => {
  const enableTrendsModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CIRCLE_NAV_BUTTONS)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableTrendsModule,
    homeId: homeEntryId,
  })
  const { width } = useWindowDimensions()
  const { selectedLocationMode } = useShouldDisplayVenueMap()
  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()
  const { removeSelectedVenue } = useSelectedVenueActions()

  const isSmallScreen = width < 375
  const shouldOpenMapDirectly = selectedLocationMode !== LocationMode.EVERYWHERE && !isWeb

  useEffect(() => {
    if (hasGraphicRedesign) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.TRENDS,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGraphicRedesign])

  const handleLogTrendsBlockClicked = (props: TrendBlock) =>
    analytics.logTrendsBlockClicked({
      moduleListID: moduleId,
      entryId: homeEntryId,
      moduleId: props.id,
      toEntryId: props.homeEntryId ?? '',
    })

  const getNavigationProps = (props: TrendBlock): TrendNavigationProps => {
    if (props.type === ContentTypes.VENUE_MAP_BLOCK && !isWeb) {
      return {
        navigateTo: shouldOpenMapDirectly ? { screen: 'VenueMap' } : undefined,
        enableNavigate: shouldOpenMapDirectly,
        onBeforeNavigate: () => {
          removeSelectedVenue()
          handleLogTrendsBlockClicked(props)
          analytics.logConsultVenueMap({ from: 'trend_block' })
          if (!shouldOpenMapDirectly) showVenueMapLocationModal()
        },
      }
    }

    return {
      navigateTo: {
        screen: 'ThematicHome',
        params: { homeId: props.homeEntryId, moduleId: props.id, from: 'trend_block' },
      },
      onBeforeNavigate: () => {
        handleLogTrendsBlockClicked(props)
      },
    }
  }

  if (!hasGraphicRedesign) return null

  return (
    <React.Fragment>
      <ViewNoBene>
        <Typo.Title3>Réservations DUO à venir</Typo.Title3>
        <Spacer.Column numberOfSpaces={4} />
      </ViewNoBene>
      <OnGoingBookingItem booking={bookingFixture} />
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={4} />

      <ViewNoBene>
        <Typo.Title4>Le pass, c’est pour tout le monde&nbsp;!</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.CaptionNeutralInfo>
          Découvre les propositions culturelles de ta région
        </Typo.CaptionNeutralInfo>
        <Spacer.Column numberOfSpaces={4} />
      </ViewNoBene>

      <Container isSmallScreen={isSmallScreen}>
        {items.map((props) => (
          <Trend key={props.title} moduleId={moduleId} {...props} {...getNavigationProps(props)} />
        ))}
      </Container>
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
      />
    </React.Fragment>
  )
}

const Container = styled.View<{ isSmallScreen: boolean }>(({ isSmallScreen, theme }) => {
  const mobileGap = isSmallScreen ? getSpacing(1) : getSpacing(2)
  return {
    flexDirection: 'row',
    gap: theme.isDesktopViewport ? getSpacing(4) : mobileGap,
    justifyContent: 'center',
    paddingBottom: theme.home.spaceBetweenModules,
  }
})

const ViewNoBene = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  maxWidth: theme.contentPage.maxWidth,
}))
