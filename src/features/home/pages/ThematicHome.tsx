import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'

const Header = ({ thematicHeader }: { thematicHeader?: ThematicHeader }) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight) {
    return <HighlightThematicHomeHeader {...thematicHeader} />
  }

  return (
    <ListHeaderContainer>
      <DefaultThematicHomeHeader
        headerTitle={thematicHeader?.title}
        headerSubtitle={thematicHeader?.subtitle}
      />
    </ListHeaderContainer>
  )
}

export const ThematicHome: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}

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
