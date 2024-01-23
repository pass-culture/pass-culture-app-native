import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import MapView from 'react-native-map-clustering'
import { returnMarkerStyle } from 'react-native-map-clustering/lib/helpers'
import { Marker } from 'react-native-maps'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Venue } from 'features/venue/types'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { computeDistanceInMeters } from 'libs/parsers'
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

  const radius = computeDistanceInMeters(
    centerPosition.latitude,
    centerPosition.longitude,
    centerPosition.latitude + centerPosition.latitudeDelta,
    centerPosition.longitude + centerPosition.longitudeDelta
  )

  const buildLocationParameterParams = {
    userLocation: centerPosition,
    selectedLocationMode,
    aroundMeRadius: radius,
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

  const { data: venues = [], refetch } = useVenues('')

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Carte des lieux" shouldDisplayBackButton />

      <StyledMapView
        initialRegion={centerPosition}
        rotateEnabled={false}
        onRegionChangeComplete={(prout) => {
          console.log({ prout })
          console.log({
            radius: computeDistanceInMeters(
              prout.latitude,
              prout.longitude,
              prout.latitude + prout.latitudeDelta,
              prout.longitude + prout.longitudeDelta
            ),
          })

          setCenterPosition(prout)
        }}
        spiralEnabled
        spiderLineColor="royalblue"
        clusterColor="royalblue"
        clusterTextColor="FFFF"
        minPoints={5}
        radius={50}
        renderCluster={({ count, ...props }) => {
          // {"clusterColor": "#FF5733", "clusterFontFamily": undefined, "clusterTextColor": "FFFF", "geometry": {"coordinates": [2.317686080932617, 48.88368971897958], "type": "Point"}, "id": 3768, "onPress": [Function anonymous], "properties": {"cluster": true, "cluster_id": 3768, "point_count": 14, "point_count_abbreviated": 14}, "type": "Feature"}

          return <ClusteredMarker {...props} count={count} />
        }}
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
        <StyledPrimaryButton wording="Rechercher dans cette zone" onPress={refetch} />
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

const ClusteredMarker = ({
  geometry,
  properties,
  onPress,
  clusterColor,
  clusterTextColor,
  clusterFontFamily,
  tracksViewChanges,
}) => {
  const points = properties.point_count
  const { width, height, fontSize, size } = returnMarkerStyle(points)

  return (
    <Marker
      key={`${geometry.coordinates[0]}_${geometry.coordinates[1]}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: points + 1 }}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}>
      <TouchableOpacity activeOpacity={0.5} style={[styles.container, { width, height }]}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: clusterColor,
              width,
              height,
              borderRadius: width / 2,
            },
          ]}
        />
        <View
          style={[
            styles.cluster,
            {
              backgroundColor: clusterColor,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}>
          <Text
            style={[
              styles.text,
              {
                color: clusterTextColor,
                fontSize,
                fontFamily: clusterFontFamily,
              },
            ]}>
            {points}
          </Text>
        </View>
      </TouchableOpacity>
    </Marker>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontWeight: 'bold',
  },
})
