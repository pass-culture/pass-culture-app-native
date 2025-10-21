import React, { useCallback, useEffect, useMemo } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { HomepageModule, isOffersModule, isVenuesModule, isVideoCarouselModule, ThematicHeader } from 'features/home/types';
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData';
import { isCloseToBottom } from 'libs/analytics';
import { useTrackAllModulesSeen } from './useTrackAllModulesSeen';
import { shouldDisplayVideoCarouselInHeader } from 'features/home/helpers/shouldDisplayVideoCarouselInHeader';
import { Spinner } from 'ui/components/Spinner';
import { PageContent, Spacer, VideoCarouselModule } from 'src/features/home/pages/GenericHome';

type HomeViewModel = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  ListHeaderComponent: React.ReactElement;
  shouldDisplayVideoInHeader: boolean;
  videoCarouselModules: HomepageModule[];
}

const fetchHomepageModules = async (pageParam = 0, allModules: HomepageModule[]): Promise<{ modules: HomepageModule[], nextPage: number | undefined }> => {
  const pageSize = 10;
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const paginatedModules = allModules.slice(start, end);
  const nextPage = end < allModules.length ? pageParam + 1 : undefined;
  return { modules: paginatedModules, nextPage };
};

export function useHomeViewModel(initialModules: HomepageModule[], homeId: string, thematicHeader: ThematicHeader | undefined, Header: React.JSX.Element, HomeBanner?: React.JSX.Element): HomeViewModel {
  const { height: screenHeight } = useWindowDimensions();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['homepageModules', homeId],
    queryFn: ({ pageParam }) => fetchHomepageModules(pageParam, initialModules),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const allFetchedModules = useMemo(() => data?.pages.flatMap(page => page.modules) || [], [data]);

  const offersModulesData: OffersModulesData = { data: [] };
  const venuesModulesData: VenuesModulesData = { venuesModulesData: { data: [] } };

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  const trackAllModulesSeen = useTrackAllModulesSeen(homeId, thematicHeader, initialModules.length);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        handleLoadMore();
      }
    },
    [screenHeight, handleLoadMore]
  );

  useEffect(() => {
    if (allFetchedModules.length > 0 && allFetchedModules.length === initialModules.length) {
      trackAllModulesSeen();
    }
  }, [allFetchedModules.length, initialModules.length, trackAllModulesSeen]);

  const shouldDisplayVideoInHeader = useMemo(
    () => shouldDisplayVideoCarouselInHeader(thematicHeader, enrichedModules),
    [thematicHeader, enrichedModules]
  );

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule);

  const ListHeaderComponent = useMemo(
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
  );

  return {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll: scrollListenerToThrottle,
    handleLoadMore,
    ListHeaderComponent,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
  };
}