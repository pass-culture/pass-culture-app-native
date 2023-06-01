import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { CategoryThematicHomeSubHeader } from 'features/home/components/headers/CategoryThematicHomeSubHeader'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { DefaultThematicHomeSubHeader } from 'features/home/components/headers/DefaultThematicHomeSubHeader'
import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { HighlightThematicHomeSubHeader } from 'features/home/components/headers/HighlightThematicHomeSubHeader'
import { GenericHome } from 'features/home/pages/GenericHome'
import { ThematicHeader, ThematicHeaderType } from 'features/home/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

interface Props {
  headerTransition: Animated.AnimatedInterpolation
  thematicHeader?: ThematicHeader
}

const Header: FunctionComponent<Props> = ({ headerTransition, thematicHeader }) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight)
    return <HighlightThematicHomeHeader headerTransition={headerTransition} {...thematicHeader} />

  if (thematicHeader?.type === ThematicHeaderType.Category)
    return <CategoryThematicHomeHeader headerTransition={headerTransition} {...thematicHeader} />

  return (
    <ListHeaderContainer>
      <DefaultThematicHomeHeader
        headerTitle={thematicHeader?.title}
        headerTransition={headerTransition}
      />
    </ListHeaderContainer>
  )
}

const SubHeader: FunctionComponent<Props> = ({ thematicHeader }) => {
  if (thematicHeader?.type === ThematicHeaderType.Highlight)
    return <HighlightThematicHomeSubHeader {...thematicHeader} />

  if (thematicHeader?.type === ThematicHeaderType.Category)
    return (
      <CategoryThematicHomeSubHeader
        title={thematicHeader?.title}
        subtitle={thematicHeader?.subtitle}
        imageUrl={thematicHeader?.imageUrl}
      />
    )

  return (
    <ListHeaderContainer>
      <DefaultThematicHomeSubHeader
        headerTitle={thematicHeader?.title}
        headerSubtitle={thematicHeader?.subtitle}
      />
    </ListHeaderContainer>
  )
}

export const ThematicHome: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'ThematicHome'>>()
  const { modules, id, thematicHeader } = useHomepageData(params.homeId) || {}

  const { onScroll, headerTransition } = useOpacityTransition()

  useEffect(() => {
    if (id) {
      analytics.logConsultHome({
        homeEntryId: id,
        from: params.from,
        moduleId: params.moduleId,
        moduleListId: params.moduleListId,
      })
    }
  }, [id, params.from, params.moduleId, params.moduleListId])

  return (
    <Container>
      <Header thematicHeader={thematicHeader} headerTransition={headerTransition} />
      <GenericHome
        modules={modules}
        homeId={id}
        Header={<SubHeader thematicHeader={thematicHeader} headerTransition={headerTransition} />}
        shouldDisplayScrollToTop
        onScroll={onScroll}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ListHeaderContainer = styled.View({
  flexGrow: 1,
  flexShrink: 0,
})
