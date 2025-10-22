/* eslint-disable */
// prettier-ignore
// @ts-nocheck
import { useInfiniteQuery } from '../../../libs/tanstack/react-query' // Import du mock
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
  Text,
  StyleSheet
} from 'react-native'

import { enrichModulesWithData } from '../core/enrichModulesWithData'
import { HomepageModule, isOffersModule, isVenuesModule, HomepageModuleType, ThematicHeader } from '../types'
import { isCloseToBottom } from '../../../libs/analytics'
import { Spinner } from '../../../ui/components/Spinner'
import { PageContent, Spacer, VideoCarouselModule } from '../../ui-mocks';
import { fetchHomepageModules } from '../api/fetchHomepageModules';

type GenericHomeProps = {
  Header?: React.JSX.Element
  HomeBanner?: React.JSX.Element
  modules: HomepageModule[] // Ces modules seront maintenant gérés par useInfiniteQuery
  homeId?: string
  thematicHeader?: ThematicHeader
}

type Offer = { id: string; title: string }
type Venue = { id: string; name: string }
type OffersModulesData = { data: Offer[] }
type VenuesModulesData = { venuesModulesData: { data: Venue[] } }

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({
  Header,
  HomeBanner,
  modules: initialModules,
  homeId = 'mock-home-id',
  thematicHeader,
}) {
  const { height: screenHeight } = useWindowDimensions()

  // Utilisation de useInfiniteQuery pour gérer la pagination (DR011)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ['homepageModules', homeId],
    queryFn: ({ pageParam }) => fetchHomepageModules(pageParam, initialModules),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })

  // Aplatir les données de toutes les pages
  const allFetchedModules = useMemo(() => data?.pages.flatMap((page) => page.modules) || [], [data])

  // Enrichir les modules (cette logique pourrait être déplacée ou optimisée)
  const offersModulesData: OffersModulesData = { data: [] } // Simplifié, en réalité viendrait d'autres queries
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } } // Simplifié

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  )

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore()
      }
    },
    [screenHeight, handleLoadMore]
  )

  if (isLoading) {
    return <Spinner />
  }
  if (isError) {
    return <Text style={styles.errorText}>Erreur de chargement des modules.</Text>
  }

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule)

  const shouldDisplayVideoInHeader =
    !thematicHeader && enrichedModules[0]?.type === HomepageModuleType.VideoCarouselModule

  const ListHeader = useMemo(
    () => (
      <View testID="listHeader">
        {Header}
        <Spacer.Column numberOfSpaces={6} />
        {shouldDisplayVideoInHeader && videoCarouselModules[0] ? (
          <VideoCarouselModule
            index={0}
            homeEntryId={homeId}
            {...videoCarouselModules[0]}
            autoplay
          />
        ) : null}
        <PageContent>{HomeBanner}</PageContent>
      </View>
    ),
    [Header, shouldDisplayVideoInHeader, videoCarouselModules, homeId, HomeBanner]
  )

  return (
    <View style={styles.container}>
      <Text style={styles.modernTitle}>Modern Home (DR011 - React Query)</Text>
      <FlatList
        data={enrichedModules}
        onScroll={scrollListenerToThrottle}
        ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
        onEndReached={handleLoadMore} // Utiliser onEndReached pour déclencher le chargement
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.moduleItem}>
            <Text>{item.title} - {item.data}</Text>
          </View>
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#dfd' },
  modernTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'green' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
  moduleItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccf', backgroundColor: '#e0ffe0' },
});