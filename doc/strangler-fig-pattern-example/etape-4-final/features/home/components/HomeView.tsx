
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/features/home/components/HomeView.tsx

import React, { FunctionComponent } from 'react';
import { FlatList, View, Text, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native';
import { Spinner } from '../../../ui/components/Spinner'; // Import du mock
import { HomepageModule } from '../types';
import { HomeListHeader } from './HomeListHeader'; // Import du nouveau composant

type HomeViewProps = {
  enrichedModules: HomepageModule[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  homeListHeaderProps: React.ComponentProps<typeof HomeListHeader>; // Props pour le header
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
    return <Text style={styles.errorText}>Erreur de chargement des modules.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.viewTitle}>HomeView (DR014 - UI Pure)</Text>
      <FlatList
        data={enrichedModules}
        onScroll={handleScroll}
        ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<HomeListHeader {...homeListHeaderProps} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.moduleItem}>
            <Text>{item.title} - {item.data}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0ffe0' },
  viewTitle: { fontSize: 16, fontWeight: 'bold', padding: 10, color: 'darkgreen' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
  moduleItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccf', backgroundColor: '#f0fff0' },
});
