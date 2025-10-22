
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
  Text,
  StyleSheet
} from 'react-native'

import { useGetVenuesData } from '../api/useGetVenuesData'
import { enrichModulesWithData } from '../core/enrichModulesWithData'
import { useGetOffersDataQuery } from '../queries/useGetOffersDataQuery'
import { HomepageModule, isOffersModule, isVenuesModule, HomepageModuleType } from '../types'
import { isCloseToBottom } from '../../../libs/analytics'
import { Spinner } from '../../../ui/components/Spinner'

import { PageContent, Spacer, VideoCarouselModule } from '../../ui-mocks';

type GenericHomeProps = {
  // ... props
}
type Offer = { id: string; title: string }
type Venue = { id: string; name: string }
type OffersModulesData = { data: Offer[] }
type VenuesModulesData = { venuesModulesData: { data: Venue[] } }

const initialNumToRender = 10
const maxToRenderPerBatch = 6
const MODULES_TIMEOUT_VALUE_IN_MS = 3000

export const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({
})
{
  // Données mockées pour l'exemple
  const modules: HomepageModule[] = useMemo(() => [
    { id: '1', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 1' },
    { id: '2', type: HomepageModuleType.VenuesModule, title: 'Legacy Venues 1' },
    { id: '3', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 2' },
    { id: '4', type: HomepageModuleType.VideoCarouselModule, title: 'Legacy Video' },
    { id: '5', type: HomepageModuleType.VenuesModule, title: 'Legacy Venues 2' },
    { id: '6', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 3' },
    { id: '7', type: HomepageModuleType.VenuesModule, title: 'Legacy Venues 3' },
    { id: '8', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 4' },
    { id: '9', type: HomepageModuleType.VenuesModule, title: 'Legacy Venues 4' },
    { id: '10', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 5' },
    { id: '11', type: HomepageModuleType.VenuesModule, title: 'Legacy Venues 5' },
    { id: '12', type: HomepageModuleType.OffersModule, title: 'Legacy Offers 6' },
  ], []);

  const offersModulesData: OffersModulesData = useGetOffersDataQuery(modules.filter(isOffersModule))
  const { venuesModulesData }: { venuesModulesData: VenuesModulesData } = useGetVenuesData(
    modules.filter(isVenuesModule)
  )

  const [maxIndex, setMaxIndex] = useState(initialNumToRender)
  const [isLoading, setIsLoading] = useState(false)
  const { height: screenHeight } = useWindowDimensions()
  const modulesIntervalId = useRef<NodeJS.Timeout | null>(null)

  const enrichedModules = useMemo(
    () => enrichModulesWithData(modules, offersModulesData, venuesModulesData).slice(0, maxIndex),
    [modules, offersModulesData, venuesModulesData, maxIndex]
  )

  const scrollListenerToThrottle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom({ ...event.nativeEvent, padding: screenHeight })) {
        if (maxIndex < modules.length) {
          setIsLoading(true)
          setMaxIndex((prevMaxIndex) => prevMaxIndex + maxToRenderPerBatch)
        }
      }
    },
    [maxIndex, modules.length, screenHeight]
  )

  useEffect(() => {
    modulesIntervalId.current = setInterval(() => {
      if (maxIndex < modules.length && isLoading) {
        setMaxIndex((prevMaxIndex) => prevMaxIndex + maxToRenderPerBatch)
      } else {
        setIsLoading(false)
      }
    }, MODULES_TIMEOUT_VALUE_IN_MS)

    return () => {
      if (modulesIntervalId.current) {
        clearInterval(modulesIntervalId.current)
        modulesIntervalId.current = null
      }
    }
  }, [modules.length, isLoading, maxIndex])

  const onContentSizeChange = () => setIsLoading(false)

  return (
    <View style={styles.container}>
      <Text style={styles.legacyTitle}>Legacy Home (Ancienne Version)</Text>
      <FlatList
        data={enrichedModules}
        onScroll={scrollListenerToThrottle}
        onContentSizeChange={onContentSizeChange}
        ListFooterComponent={isLoading ? <Spinner /> : null}
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

export const GenericHomeLegacy: FunctionComponent<GenericHomeProps> = (props) => {
  return <OnlineHome {...props} />
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fdd' },
  legacyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'red' },
  moduleItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
