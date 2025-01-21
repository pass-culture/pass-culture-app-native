import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import { ChroniclesWebMetaHeader } from 'features/chronicle/components/ChroniclesWebMetaHeader/ChroniclesWebMetaHeader'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { TypoDS, getSpacing } from 'ui/theme'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const { goBack } = useGoBack('Offer', { id: offerId })
  const { data: offer } = useOffer({ offerId })
  const { data: offerChronicles } = useChronicles({ offerId })

  const { headerTransition, onScroll } = useOpacityTransition()
  const { appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const scrollViewRef = useRef<ScrollView>(null)

  if (!offer || !offerChronicles) return null

  const title = `Tous les avis sur "${offer.name}"`
  const transformedChronicles: ChronicleCardData[] = offerChroniclesToChronicleCardData(
    offerChronicles.chronicles
  )

  return (
    <React.Fragment>
      <ChroniclesWebMetaHeader title={title} />
      <ChroniclesHeader headerTransition={headerTransition} title={title} handleGoBack={goBack} />
      <ScrollView
        scrollEventThrottle={16}
        bounces={false}
        ref={scrollViewRef}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: getSpacing(10) }}>
        <ChroniclesContainer>
          <TypoDS.Title2>Tous les avis</TypoDS.Title2>
          <ChronicleCardList data={transformedChronicles} horizontal={false} />
        </ChroniclesContainer>
      </ScrollView>
    </React.Fragment>
  )
}

const ChroniclesContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(4),
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
