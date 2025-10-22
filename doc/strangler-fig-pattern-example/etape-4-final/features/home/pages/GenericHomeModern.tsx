
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HomepageModule, HomepageModuleType, ThematicHeader } from '../types'
import { useHomeViewModel } from '../hooks/useHomeViewModel'
import { HomeView } from '../components/HomeView'

type GenericHomeProps = {
  Header?: React.JSX.Element
  HomeBanner?: React.JSX.Element
  modules?: HomepageModule[] // Ces modules seront maintenant gérés par useInfiniteQuery
  homeId?: string
  thematicHeader?: ThematicHeader
}

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome(props) {
  const { Header, HomeBanner, modules = [], homeId = 'mock-home-id', thematicHeader } = props

  // Utilisation du ViewModel pour obtenir toutes les données et callbacks (DR014)
  const {
    enrichedModules,
    isFetchingNextPage,
    isLoading,
    isError,
    handleScroll,
    handleLoadMore,
    homeListHeaderProps,
  } = useHomeViewModel(modules, homeId, thematicHeader, Header, HomeBanner)

  return (
    <View style={styles.container}>
      <Text style={styles.modernTitle}>Modern Home (DR012, DR013, DR014, DR022)</Text>
      <HomeView
        enrichedModules={enrichedModules}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        handleScroll={handleScroll}
        handleLoadMore={handleLoadMore}
        homeListHeaderProps={homeListHeaderProps}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#dfd' },
  modernTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'green' },
});
