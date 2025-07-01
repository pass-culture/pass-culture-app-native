import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, PropsWithChildren, useCallback, useMemo, useRef } from 'react'
import { FlatList, InteractionManager } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { ChronicleCardListHeader } from 'features/chronicle/components/ChronicleCardListHeader/ChronicleCardListHeader'
import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import { ChroniclesWebMetaHeader } from 'features/chronicle/components/ChroniclesWebMetaHeader/ChroniclesWebMetaHeader'
import { BOOK_CLUB_SUBCATEGORIES, CINE_CLUB_SUBCATEGORIES } from 'features/chronicle/constant'
import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { CineClubCertification } from 'ui/svg/CineClubCertification'
import { getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  offerId: number
  offerName: string
  chronicleCardsData: ChronicleCardData[]
  offerSubcategoryId: SubcategoryIdEnum
}>

export const ChroniclesBase: FunctionComponent<Props> = ({
  offerId,
  offerName,
  chronicleCardsData,
  offerSubcategoryId,
  children,
}) => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const chronicleId = route.params?.chronicleId
  const { navigate } = useNavigation<UseNavigationType>()
  const { contentPage, appBarHeight, isDesktopViewport } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { headerTransition, onScroll } = useOpacityTransition()
  const { visible, showModal, hideModal } = useModal(false)

  const chroniclesListRef = useRef<FlatList<ChronicleCardData>>(null)

  const selectedChronicle = chronicleCardsData.findIndex((item) => item.id === chronicleId) ?? -1

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

  const title = `Tous les avis sur "${offerName}"`

  const handleGoBack = () => {
    navigate('Offer', { id: offerId, openModalOnNavigation: undefined })
  }

  const handleOnShowRecoButtonPress = () => {
    hideModal()
    InteractionManager.runAfterInteractions(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  const thunbnailComponent = useMemo(() => {
    if (BOOK_CLUB_SUBCATEGORIES.includes(offerSubcategoryId)) {
      return <BookClubIcon testID="bookClubIcon" />
    }
    if (CINE_CLUB_SUBCATEGORIES.includes(offerSubcategoryId)) {
      return <CineClubIcon testID="cineClubIcon" />
    }
    return undefined
  }, [offerSubcategoryId])

  return (
    <React.Fragment>
      <ChroniclesWebMetaHeader title={title} />
      <ChroniclesHeader
        headerTransition={headerTransition}
        title={title}
        handleGoBack={handleGoBack}
      />
      <FullFlexRow>
        {children}

        <StyledChronicleCardList
          data={chronicleCardsData}
          horizontal={false}
          separatorSize={6}
          headerComponent={<ChronicleCardListHeader onPressMoreInfo={showModal} />}
          ref={chroniclesListRef}
          onScroll={onScroll}
          contentContainerStyle={{
            paddingTop: headerHeight,
            ...(isDesktopViewport
              ? { paddingBottom: headerHeight }
              : {
                  paddingBottom: getSpacing(10),
                  marginTop: getSpacing(4),
                  marginHorizontal: contentPage.marginHorizontal,
                }),
          }}
          onLayout={handleLayout}
          thunbnailComponent={thunbnailComponent}
        />
      </FullFlexRow>
      <ChroniclesWritersModal
        closeModal={hideModal}
        isVisible={visible}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}
      />
    </React.Fragment>
  )
}

const StyledChronicleCardList = styled(ChronicleCardList)({
  flex: 1,
})

const FullFlexView = styled.View({
  flex: 1,
})

const FullFlexRow = styled(FullFlexView)({
  flexDirection: 'row',
  columnGap: getSpacing(18),
})

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.bookclub,
}))``

const CineClubIcon = styled(CineClubCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.cineclub,
}))``
