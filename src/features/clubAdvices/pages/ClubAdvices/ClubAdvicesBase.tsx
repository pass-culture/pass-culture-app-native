import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, PropsWithChildren, useCallback, useRef } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { AdviceCardListHeader } from 'features/advices/components/AdviceCardListHeader/AdviceCardListHeader'
import { AdvicesHeader } from 'features/advices/components/AdvicesHeader/AdvicesHeader'
import { AdvicesWebMetaHeader } from 'features/advices/components/AdvicesWebMetaHeader/AdvicesWebMetaHeader'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  offerId: number
  offerName: string
  offerCategoryId: string
  adviceCardsData: AdviceCardData[]
  variantInfo: AdviceVariantInfo
  onShowRecoButtonPress: VoidFunction
}>

export const ClubAdvicesBase: FunctionComponent<Props> = ({
  offerId,
  offerName,
  offerCategoryId,
  adviceCardsData,
  variantInfo,
  onShowRecoButtonPress,
  children,
}) => {
  const route = useRoute<UseRouteType<'ClubAdvices'>>()
  const adviceId = route.params?.adviceId
  const { contentPage, appBarHeight, isDesktopViewport, designSystem } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top
  const { goBack } = useGoBack('Offer')

  const { headerTransition, onScroll } = useOpacityTransition()
  const { visible, showModal, hideModal } = useModal(false)

  const advicesListRef = useRef<FlatList<AdviceCardData>>(null)

  const selectedAdvice = adviceCardsData.findIndex((item) => item.id === adviceId) ?? -1

  const handleLayout = useCallback(() => {
    if (selectedAdvice !== -1) {
      runAfterInteractionsMobile(() => {
        advicesListRef.current?.scrollToIndex({
          index: selectedAdvice,
          animated: true,
          viewOffset: headerHeight,
        })
      })
    }
  }, [selectedAdvice, headerHeight])

  const title = `Tous les avis sur "${offerName}"`

  const handleOnShowRecoButtonPress = () => {
    hideModal()
    runAfterInteractionsMobile(() => {
      onShowRecoButtonPress()
    })
  }

  const handleOnShowAdvicesWritersModal = () => {
    void analytics.logClickWhatsClub({
      offerId: offerId.toString(),
      from: 'chronicles',
      categoryName: offerCategoryId,
    })
    showModal()
  }

  return (
    <React.Fragment>
      <AdvicesWebMetaHeader title={title} />
      <AdvicesHeader headerTransition={headerTransition} title={title} handleGoBack={goBack} />
      <FullFlexRow>
        {children}

        <StyledAdviceCardList
          data={adviceCardsData}
          horizontal={false}
          separatorSize={6}
          headerComponent={
            <AdviceCardListHeader
              title={`Tous les avis du ${variantInfo.labelReaction}`}
              buttonWording={variantInfo.modalTitle}
              onPressMoreInfo={handleOnShowAdvicesWritersModal}
            />
          }
          ref={advicesListRef}
          onScroll={onScroll}
          contentContainerStyle={{
            paddingTop: headerHeight,
            ...(isDesktopViewport
              ? { paddingBottom: headerHeight }
              : {
                  paddingBottom: designSystem.size.spacing.xxxl,
                  marginTop: designSystem.size.spacing.l,
                  marginHorizontal: contentPage.marginHorizontal,
                }),
          }}
          onLayout={handleLayout}
          cardIcon={variantInfo.Icon}
          tag={variantInfo.tag}
        />
      </FullFlexRow>
      <AdvicesWritersModal
        closeModal={hideModal}
        isVisible={visible}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}
        modalWording={variantInfo.modalWording}
        buttonWording={variantInfo.buttonWording}
      />
    </React.Fragment>
  )
}

const StyledAdviceCardList = styled(AdviceCardList)({
  flex: 1,
})

const FullFlexView = styled.View({
  flex: 1,
})

const FullFlexRow = styled(FullFlexView)({
  flexDirection: 'row',
  columnGap: getSpacing(18),
})
