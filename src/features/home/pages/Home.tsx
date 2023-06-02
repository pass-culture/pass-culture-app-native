import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'

const Header = ({ thematicHeader }: { thematicHeader?: { title?: string; subtitle?: string } }) => (
  <ListHeaderContainer>
    {
      // TODO(PC-20066): remove transitional home header split
      thematicHeader?.title ? (
        <DefaultThematicHomeHeader
          headerTitle={thematicHeader.title}
          headerSubtitle={thematicHeader.subtitle}
        />
      ) : (
        <HomeHeader />
      )
    }
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, id, thematicHeader } = useHomepageData(params?.entryId) || {}
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
      Header={<Header thematicHeader={thematicHeader} />}
    />
  )
}

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
