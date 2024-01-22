import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import MapView from 'react-native-map-clustering'
import { Marker } from 'react-native-maps'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

// const fetchVenues = async (
//   { query }: FetchVenuesParameters,
//   userLocation: Position
// ): Promise<Venue[]> => {
//   const venuesIndex = client.initIndex(env.ALGOLIA_VENUES_INDEX_NAME)
//   const geolocParams = buildGeolocationParameter(
//     { locationType: LocationType.AROUND_ME, aroundRadius: 5 },
//     userLocation
//   )
//   const algoliaSearchParams = buildFetchVenuesQueryParameters({
//     query,
//   })

//   try {
//     const rawAlgoliaVenuesResponse = await venuesIndex.search<AlgoliaVenue>(
//       algoliaSearchParams.query,
//       {
//         ...algoliaSearchParams.requestOptions,
//         ...geolocParams,
//         hitsPerPage: 1000,
//       }
//     )

//     const rawVenues = adaptGenericAlgoliaTypes(rawAlgoliaVenuesResponse)
//     const adaptedVenues = adaptAlgoliaVenues(rawVenues)

//     return adaptedVenues
//   } catch (error) {
//     captureAlgoliaError(error)
//     return [] as Venue[]
//   }
// }
const STALE_TIME_VENUES = 5 * 60 * 1000

const INITIAL_REGION = {
  latitude: 48.8513409,
  longitude: 2.339999,
  latitudeDelta: 15.5,
  longitudeDelta: 15.5,
}

export const Dora: FunctionComponent = () => {
  const { userLocation, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const { top } = useCustomSafeInsets()
  const [centerPosition, setCenterPosition] = useState({
    latitude: userLocation?.latitude ?? 47.023205,
    longitude: userLocation?.longitude ?? 2.399078,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  })

  const buildLocationParameterParams = {
    userLocation,
    selectedLocationMode,
    aroundMeRadius,
    aroundPlaceRadius,
  }

  const useVenues = (query: string) => {
    const netInfo = useNetInfoContext()

    return useQuery<Venue[]>(
      [QueryKeys.VENUES, query, buildLocationParameterParams],
      () =>
        fetchVenues({
          query: '',
          buildLocationParameterParams,
        }),
      {
        staleTime: STALE_TIME_VENUES,
        enabled: !!netInfo.isConnected,
      }
    )
  }

  const { data: venues = [] } = useVenues('')

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Carte des lieux" shouldDisplayBackButton />

      <StyledMapView
        initialRegion={centerPosition}
        rotateEnabled={false}
        onRegionChangeComplete={setCenterPosition}
        spiralEnabled
        spiderLineColor="royalblue"
        clusterColor="#FF5733"
        clusterTextColor="FFFF"
        // renderCluster={}
        showsUserLocation>
        {venues.map((venue) => (
          <Marker
            key={venue?.venueId}
            coordinate={{
              latitude: venue?._geoloc?.lat ?? 0,
              longitude: venue?._geoloc?.lng ?? 0,
            }}
            onPress={() => navigate('Venue', { id: venue?.venueId ?? 0 })}>
            <StyledMarkerView>
              <StyledBookstore size={20} />
            </StyledMarkerView>
          </Marker>
        ))}
      </StyledMapView>
      <StyledView top={top}>
        <StyledPrimaryButton wording="Rechercher dans cette zone" />
      </StyledView>
    </React.Fragment>
  )
}

const StyledBookstore = styled(Bookstore)({
  color: '#320096',
})
const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })

const StyledView = styled.View<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top: top + getSpacing(16),
  alignItems: 'center',
  left: 0,
  right: 0,
  marginHorizontal: getSpacing(6),
}))

const StyledPrimaryButton = styled(ButtonPrimary)({})
const StyledMarkerView = styled.View({
  height: 35,
  width: 35,
  backgroundColor: '#FFF',
  borderWidth: 1,
  borderColor: '#320096',
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
})
