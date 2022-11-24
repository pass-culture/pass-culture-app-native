import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api'
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
  const { modules, homeEntryId } = useHomepageData(params?.entryId) || {}

  return <GenericHome modules={modules} homeEntryId={homeEntryId} Header={<Header />} />
}

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
