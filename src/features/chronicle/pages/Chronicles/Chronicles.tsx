import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import { ChroniclesWebMetaHeader } from 'features/chronicle/components/ChroniclesWebMetaHeader/ChroniclesWebMetaHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS, getSpacing } from 'ui/theme'

export const Chronicles: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()
  const { appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const scrollViewRef = useRef<ScrollView>(null)

  const title = 'Tous les avis sur "Mon offre incroyable"'

  return (
    <React.Fragment>
      <ChroniclesWebMetaHeader title={title} />
      <ChroniclesHeader headerTransition={headerTransition} title={title} />
      <ScrollView
        scrollEventThrottle={16}
        bounces={false}
        ref={scrollViewRef}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: getSpacing(10) }}>
        <ChroniclesContainer gap={6}>
          <TypoDS.Title2>Tous les avis</TypoDS.Title2>
          <StyledView />
        </ChroniclesContainer>
      </ScrollView>
    </React.Fragment>
  )
}

const ChroniclesContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: getSpacing(4),
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledView = styled.View({
  height: 800,
})
