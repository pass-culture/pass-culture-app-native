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
import { fetchHomepageModules } from 'src/features/home/api/fetchHomepageModules';
import { HomeListHeaderComponentProps } from 'src/features/home/components/HomeListHeaderComponent';

type HomeViewModel = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  homeListHeaderProps: HomeListHeaderComponentProps;
  shouldDisplayVideoInHeader: boolean;
  videoCarouselModules: HomepageModule[];
}



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



  const homeListHeaderProps = useMemo(() => ({
    Header,
    HomeBanner,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
    homeId,
  }), [Header, HomeBanner, shouldDisplayVideoInHeader, videoCarouselModules, homeId]);

  return {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll: scrollListenerToThrottle,
    handleLoadMore,
    homeListHeaderProps,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
  };
}