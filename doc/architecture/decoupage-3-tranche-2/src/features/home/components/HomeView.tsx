/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react';
import { FlatList, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Spinner } from 'ui/components/Spinner';
import { HomepageModule } from 'features/home/types';
import { HomeListHeaderComponent, HomeListHeaderComponentProps } from './HomeListHeaderComponent';

type HomeViewProps = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  homeListHeaderProps: HomeListHeaderProps;
}

export const HomeView: FunctionComponent<HomeViewProps> = ({
  enrichedModules,
  isFetchingNextPage,
  isLoading,
  isError,
  handleScroll,
  handleLoadMore,
  homeListHeaderProps,
}) => {
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <Text>Erreur de chargement des modules.</Text>;
  }

  return (
    <FlatList
      data={enrichedModules}
      onScroll={handleScroll}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={<HomeListHeaderComponent {...homeListHeaderProps} />}
    />
  );
};
