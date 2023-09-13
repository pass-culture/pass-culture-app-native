import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { PERFORMANCE_HOME_CREATION, PERFORMANCE_HOME_LOADING } from 'features/home/constants'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/geolocation'
import { useFunctionOnce } from 'libs/hooks'
import { usePerformanceCalculation } from 'shared/performance/usePerformanceCalculation/usePerformanceCalculation'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  const { start } = usePerformanceCalculation()
  const startPerfHomeLoadingOnce = useFunctionOnce(() => start(PERFORMANCE_HOME_LOADING))
  const startPerfHomeCreationOnce = useFunctionOnce(() => start(PERFORMANCE_HOME_CREATION))
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, id } = useHomepageData() || {}
  const { setCustomPosition } = useLocation()

  startPerfHomeCreationOnce()
  startPerfHomeLoadingOnce()

  useEffect(() => {
    if (id) {
      analytics.logConsultHome({ homeEntryId: id })
    }
  }, [id])

  useEffect(() => {
    if (params?.latitude && params?.longitude) {
      setCustomPosition({ latitude: params.latitude, longitude: params.longitude })
    }
  }, [params?.latitude, params?.longitude, setCustomPosition])

  return (
    <GenericHome
      modules={modules}
      homeId={id}
      Header={<Header />}
      videoModuleId={params?.videoModuleId}
      statusBar={<StatusBarBlurredBackground />}
    />
  )
}

const ListHeaderContainer = styled.View(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  zIndex: theme.zIndex.header,
}))
