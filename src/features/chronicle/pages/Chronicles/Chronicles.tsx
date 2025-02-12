import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useRef } from 'react'
import { FlatList, InteractionManager } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import { ChroniclesWebMetaHeader } from 'features/chronicle/components/ChroniclesWebMetaHeader/ChroniclesWebMetaHeader'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { TypoDS, getSpacing } from 'ui/theme'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const chronicleId = route.params?.chronicleId
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOffer({ offerId })
  const { data: chronicleCardsData } = useChronicles<ChronicleCardData[]>({
    offerId,
    select: ({ chronicles }) => offerChroniclesToChronicleCardData(chronicles),
  })

  const { headerTransition, onScroll } = useOpacityTransition()
  const { appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const { contentPage } = useTheme()
  const headerHeight = appBarHeight + top

  const chroniclesListRef = useRef<FlatList<ChronicleCardData>>(null)

  const selectedChronicle = chronicleCardsData?.findIndex((item) => item.id === chronicleId) ?? -1

  const handleLayout = useCallback(() => {
    if (selectedChronicle !== -1) {
      InteractionManager.runAfterInteractions(() => {
        chroniclesListRef.current?.scrollToIndex({
          index: selectedChronicle,
          animated: true,
          viewOffset: headerHeight,
        })
      })
    }
  }, [selectedChronicle, headerHeight])

  const handleGoBack = () => {
    navigate('Offer', { id: offerId, openModalOnNavigation: undefined })
  }

  if (!offer || !chronicleCardsData) return null

  const title = `Tous les avis sur "${offer.name}"`

  return (
    <React.Fragment>
      <ChroniclesWebMetaHeader title={title} />
      <ChroniclesHeader
        headerTransition={headerTransition}
        title={title}
        handleGoBack={handleGoBack}
      />
      <ChronicleCardList
        data={chronicleCardsData}
        horizontal={false}
        separatorSize={6}
        headerComponent={<StyledTitle2>Tous les avis</StyledTitle2>}
        ref={chroniclesListRef}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: getSpacing(10),
          marginTop: getSpacing(4),
          marginHorizontal: contentPage.marginHorizontal,
        }}
        onLayout={handleLayout}
      />
    </React.Fragment>
  )
}

const StyledTitle2 = styled(TypoDS.Title2)({
  marginBottom: getSpacing(6),
})
