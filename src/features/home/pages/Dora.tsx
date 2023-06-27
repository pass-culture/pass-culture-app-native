import React, { FunctionComponent, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import styled from 'styled-components/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useNavigation } from '@react-navigation/native'
import { Position, useGeolocation } from 'libs/geolocation'
import { useQuery } from 'react-query'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Venue } from 'features/venue/types'
import { AlgoliaVenue, FetchVenuesParameters } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { adaptGenericAlgoliaTypes } from 'libs/algolia/fetchAlgolia/helpers/adaptGenericAlgoliaTypes'
import { env } from 'libs/environment'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { LocationType } from 'features/search/enums'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { getSpacing } from 'ui/theme'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'

const fetchVenues = async ({
    query
}: FetchVenuesParameters, userPosition: Position): Promise<Venue[]> => {
    const venuesIndex = client.initIndex(env.ALGOLIA_VENUES_INDEX_NAME)
    const geolocParams = buildGeolocationParameter({ locationType: LocationType.AROUND_ME, aroundRadius: 5 }, userPosition)
    const algoliaSearchParams = buildFetchVenuesQueryParameters({
        query
    })


    try {
        const rawAlgoliaVenuesResponse = await venuesIndex.search<AlgoliaVenue>(
            algoliaSearchParams.query,
            {
                ...algoliaSearchParams.requestOptions,
                ...geolocParams,
                hitsPerPage: 1000
            }
        )

        const rawVenues = adaptGenericAlgoliaTypes(rawAlgoliaVenuesResponse)
        const adaptedVenues = adaptAlgoliaVenues(rawVenues)

        return adaptedVenues
    } catch (error) {
        captureAlgoliaError(error)
        return [] as Venue[]
    }
}
const STALE_TIME_VENUES = 5 * 60 * 1000

const useVenues = (query: string, userPosition: Position) => {
    const netInfo = useNetInfoContext()
    return useQuery<Venue[]>([QueryKeys.VENUES, query], () => fetchVenues({ query: query }, userPosition = userPosition), {
        staleTime: STALE_TIME_VENUES,
        enabled: !!netInfo.isConnected && query.length > 0,
    })

}

export const Dora: FunctionComponent = () => {
    const { userPosition } = useGeolocation()
    const { navigate } = useNavigation<UseNavigationType>()
    const { top } = useCustomSafeInsets()
    const [centerPosition, setCenterPosition] = useState({
        latitude: userPosition?.latitude ?? 47.023205,
        longitude: userPosition?.longitude ?? 2.399078,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    })
    const { data: venues, refetch } = useVenues(" ", centerPosition)
    if (!venues) return null

    return (
        <React.Fragment>
            <PageHeaderSecondary
                title='Carte des lieux'
                shouldDisplayBackButton={true}
            />

            <StyledMapView
                initialRegion={centerPosition}
                rotateEnabled={false}
                onRegionChangeComplete={setCenterPosition}
                showsUserLocation={true}
            >
                {venues.map(
                    (venue) =>
                        <Marker
                            coordinate={{
                                latitude: venue.geoloc.lat,
                                longitude: venue.geoloc.lng,
                            }}
                            onPress={() => navigate('Venue', { id: venue.venueId })} >
                            <StyledMarkerView>
                                <Bookstore size={20} color={'#320096'} />
                            </StyledMarkerView>
                        </Marker>
                )}
            </StyledMapView>
            <StyledView top={top}            >
                <StyledPrimaryButton
                    wording='Rechercher dans cette zone'
                    onPress={() => refetch()}
                />
            </StyledView>
        </React.Fragment>
    )
}

const StyledMapView = styled(MapView)({ height: "100%", width: "100%" })

const StyledView = styled.View<{ top: number }>(({ top }) => ({
    position: 'absolute',
    top: top + getSpacing(16),
    alignItems: "center",
    left: 0,
    right: 0,
    marginHorizontal: getSpacing(6)
}))

const StyledPrimaryButton = styled(ButtonPrimary)({
})
const StyledMarkerView = styled.View({
    height: 35,
    width: 35,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#320096',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"

})
