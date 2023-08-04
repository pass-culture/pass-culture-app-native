import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, id } = useHomepageData() || {}
  const { setCustomPosition } = useGeolocation()

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

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
