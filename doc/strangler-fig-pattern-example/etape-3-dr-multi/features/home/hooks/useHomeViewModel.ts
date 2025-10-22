
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/features/home/hooks/useHomeViewModel.ts

import React, { useCallback, useEffect, useMemo } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { useInfiniteQuery } from '../../../libs/tanstack/react-query'; // Import du mock
import { HomepageModule, isOffersModule, isVenuesModule, isVideoCarouselModule, ThematicHeader } from '../types';
import { enrichModulesWithData } from '../core/enrichModulesWithData';
import { isCloseToBottom } from '../../../libs/analytics'; // Import du mock
import { useTrackAllModulesSeen } from './useTrackAllModulesSeen'; // Import du hook DR013
import { shouldDisplayVideoCarouselInHeader } from '../core/shouldDisplayVideoCarouselInHeader'; // Import de la fonction pure DR012
import { fetchHomepageModules } from '../api/fetchHomepageModules'; // Import de la fonction de fetch
import { HomeListHeader } from '../components/HomeListHeader'; // Import du composant DR022

type HomeViewModel = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  homeListHeaderProps: React.ComponentProps<typeof HomeListHeader>;
}

export function useHomeViewModel(initialModules: HomepageModule[], homeId: string, thematicHeader: ThematicHeader | undefined, Header?: React.JSX.Element, HomeBanner?: React.JSX.Element): HomeViewModel {
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

  const offersModulesData: any = { data: [] }; // Simplifié
  const venuesModulesData: any = { venuesModulesData: { data: [] } }; // Simplifié

  const enrichedModules = useMemo(
    () => enrichModulesWithData(allFetchedModules, offersModulesData, venuesModulesData),
    [allFetchedModules, offersModulesData, venuesModulesData]
  );

  const trackAllModulesSeen = useTrackAllModulesSeen(homeId || 'mock-home-id', thematicHeader, initialModules.length);

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
    () => shouldDisplayVideoCarouselInHeader(thematicHeader, enrichedModules), // DR012
    [thematicHeader, enrichedModules]
  );

  const videoCarouselModules = enrichedModules.filter(isVideoCarouselModule);

  const homeListHeaderProps = useMemo(() => ({
    Header,
    HomeBanner,
    shouldDisplayVideoInHeader,
    videoCarouselModules,
    homeId: homeId || 'mock-home-id',
  }), [Header, HomeBanner, shouldDisplayVideoInHeader, videoCarouselModules, homeId]);

  return {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll: scrollListenerToThrottle,
    handleLoadMore,
    homeListHeaderProps,
  };
}
