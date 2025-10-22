/* eslint-disable */
// prettier-ignore
// @ts-nocheck
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
  Text,
} from 'react-native'
import { PageContent, Spacer, VideoCarouselModule } from 'src/features/home/pages/GenericHome'

import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData'
import { HomepageModule, isVideoCarouselModule, ThematicHeader } from 'features/home/types'
import { isCloseToBottom } from 'libs/analytics'
import { Spinner } from 'ui/components/Spinner'

type GenericHomeProps = {
  Header: React.JSX.Element
  HomeBanner?: React.JSX.Element
  modules: HomepageModule[]
  homeId: string
  thematicHeader?: ThematicHeader
}
type Offer = { id: string; title: string }
type Venue = { id: string; name: string }
type OffersModulesData = { data: Offer[] }
type VenuesModulesData = { venuesModulesData: { data: Venue[] } }

const fetchHomepageModules = async (
  pageParam = 0,
  allModules: HomepageModule[]
): Promise<{ modules: HomepageModule[]; nextPage: number | undefined }> => {
  const pageSize = 10
  const start = pageParam * pageSize
  const end = start + pageSize
  const paginatedModules = allModules.slice(start, end)
  const nextPage = end < allModules.length ? pageParam + 1 : undefined
  return { modules: paginatedModules, nextPage }
}

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({
  Header,
  HomeBanner,
  modules: initialModules,
  homeId,
  thematicHeader,
}) {
  const { height: screenHeight } = useWindowDimensions()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['homepageModules', homeId],
      queryFn: ({ pageParam }) => fetchHomepageModules(pageParam, initialModules),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 0,
    })

  const allFetchedModules = useMemo(() => data?.pages.flatMap((page) => page.modules) || [], [data])

  const offersModulesData: OffersModulesData = { data: [] }
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } }

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
    return <Text>Erreur de chargement des modules.</Text>
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
    <FlatList
      data={enrichedModules}
      onScroll={scrollListenerToThrottle}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeader}
    />
  )
})