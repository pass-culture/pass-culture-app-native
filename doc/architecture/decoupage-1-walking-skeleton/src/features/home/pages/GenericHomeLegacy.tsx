/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native'

import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData'
import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { HomepageModule, isOffersModule, isVenuesModule } from 'features/home/types'
import { isCloseToBottom } from 'libs/analytics'
import { Spinner } from 'ui/components/Spinner'

type GenericHomeProps = {
  modules: HomepageModule[]
  homeId: string
}
type Offer = { id: string; title: string }
type Venue = { id: string; name: string }
type OffersModulesData = { data: Offer[] }
type VenuesModulesData = { data: Venue[] }

const initialNumToRender = 10
const maxToRenderPerBatch = 6
const MODULES_TIMEOUT_VALUE_IN_MS = 3000

const OnlineHome: FunctionComponent<GenericHomeProps> = React.memo(function OnlineHome({
  modules,
  homeId,
}) {
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
    <FlatList
      data={enrichedModules}
      onScroll={scrollListenerToThrottle}
      onContentSizeChange={onContentSizeChange}
      ListFooterComponent={isLoading ? <Spinner /> : null}
      // ... autres props
    />
  )
})

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // ... logique de connexion/déconnexion simplifiée
  return <OnlineHome {...props} />
}