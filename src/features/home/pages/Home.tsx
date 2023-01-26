import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'

const Header = ({ thematicHeader }: { thematicHeader?: { title?: string; subtitle?: string } }) => (
  <ListHeaderContainer>
    {
      // TODO(PC-20066): remove transitional home header split
      thematicHeader?.title ? (
        <ThematicHomeHeader
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
