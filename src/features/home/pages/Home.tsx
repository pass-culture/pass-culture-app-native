import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'

const Header = () => (
  <ListHeaderContainer>
    <HomeHeader />
  </ListHeaderContainer>
)

export const Home: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Home'>>()
  const { modules, id } = useHomepageData(params?.entryId) || {}

  return <GenericHome modules={modules} homeId={id} Header={<Header />} />
}

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
