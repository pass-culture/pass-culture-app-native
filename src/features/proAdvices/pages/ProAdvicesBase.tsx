import React, { FunctionComponent, PropsWithChildren, useCallback, useRef } from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, useTheme } from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { AdviceCardListHeader } from 'features/advices/components/AdviceCardListHeader/AdviceCardListHeader'
import { AdvicesHeader } from 'features/advices/components/AdvicesHeader/AdvicesHeader'
import { AdvicesWebMetaHeader } from 'features/advices/components/AdvicesWebMetaHeader/AdvicesWebMetaHeader'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { AdviceCardData } from 'features/advices/types'
import { PRO_ADVICE_VARIANT_CONFIG } from 'features/clubAdvices/constants'
import { getScrollMetrics } from 'features/proAdvices/helpers/getScrollMetrics'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { Spinner } from 'ui/components/Spinner'
import { getSpacing } from 'ui/theme'

const LOAD_NEXT_PAGE_SCROLL_THRESHOLD_RATIO = 0.5
const MIN_SCROLL_OFFSET_TO_ENABLE_NEXT_PAGE = 1

type Props = PropsWithChildren<{
  title: string
  advices: AdviceCardData[]
  goBack: () => void
  id?: number
  nbAdvices?: number
  onEndReached?: () => void
  isFetchingNextPage?: boolean
  thumbnailHeight?: number
}>

export const ProAdvicesBase: FunctionComponent<Props> = ({
  title,
  advices,
  goBack,
  id,
  nbAdvices,
  onEndReached,
  isFetchingNextPage,
  thumbnailHeight,
  children,
}) => {
  const { visible, showModal, hideModal } = useModal(false)
  const advicesListRef = useRef<FlatList<AdviceCardData>>(null)
  const lastEndReachedContentHeightRef = useRef(0)
  const { contentPage, appBarHeight, isDesktopViewport, designSystem } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top
  const renderedAdvicesBatchSize = Math.max(advices.length, 10)

  const selectedAdvice = advices?.findIndex((item) => item.id === id) ?? -1

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

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onEndReached || isFetchingNextPage) return

      const metrics = getScrollMetrics(event)

      if (!metrics) return

      const { contentHeight, offsetY, viewportHeight } = metrics

      const distanceFromEnd = contentHeight - (offsetY + viewportHeight)
      const threshold = viewportHeight * LOAD_NEXT_PAGE_SCROLL_THRESHOLD_RATIO
      const shouldLoadNextPage =
        contentHeight > viewportHeight &&
        offsetY > MIN_SCROLL_OFFSET_TO_ENABLE_NEXT_PAGE &&
        distanceFromEnd <= threshold &&
        lastEndReachedContentHeightRef.current !== contentHeight

      if (shouldLoadNextPage) {
        lastEndReachedContentHeightRef.current = contentHeight
        onEndReached()
      }
    },
    [isFetchingNextPage, onEndReached]
  )

  const { headerTransition, onScroll } = useOpacityTransition({ listener: handleScroll })

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (advices.length <= 10) {
        lastEndReachedContentHeightRef.current = 0
        return
      }

      if (lastEndReachedContentHeightRef.current > height) {
        lastEndReachedContentHeightRef.current = 0
      }
    },
    [advices.length]
  )

  return (
    <React.Fragment>
      <AdvicesWebMetaHeader title={title} />
      <AdvicesHeader headerTransition={headerTransition} title={title} handleGoBack={goBack} />
      <Container>
        {children}
        <StyledAdviceCardList
          data={advices}
          horizontal={false}
          separatorSize={6}
          headerComponent={
            <AdviceCardListHeader
              title={`${nbAdvices ?? advices.length} avis des pros`}
              buttonWording={PRO_ADVICE_VARIANT_CONFIG.modalTitle}
              onPressMoreInfo={showModal}
            />
          }
          ref={advicesListRef}
          onScroll={onScroll}
          onContentSizeChange={handleContentSizeChange}
          ListFooterComponent={
            isFetchingNextPage ? (
              <FooterSpinner>
                <Spinner testID="pro-advices-next-page-loader" />
              </FooterSpinner>
            ) : null
          }
          initialNumToRender={renderedAdvicesBatchSize}
          maxToRenderPerBatch={renderedAdvicesBatchSize}
          contentContainerStyle={{
            paddingTop: headerHeight,
            ...(isDesktopViewport
              ? {
                  paddingBottom: headerHeight,
                  marginHorizontal: children ? undefined : contentPage.marginHorizontal,
                }
              : {
                  paddingBottom: designSystem.size.spacing.xxxl,
                  marginTop: designSystem.size.spacing.l,
                  marginHorizontal: contentPage.marginHorizontal,
                }),
          }}
          onLayout={handleLayout}
          thumbnailHeight={thumbnailHeight}
        />
      </Container>

      <AdvicesWritersModal
        closeModal={hideModal}
        isVisible={visible}
        onButtonPress={hideModal}
        modalWording={PRO_ADVICE_VARIANT_CONFIG.modalWording}
        buttonWording={PRO_ADVICE_VARIANT_CONFIG.buttonWording}
      />
    </React.Fragment>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  columnGap: getSpacing(18),
})

const StyledAdviceCardList = styled(AdviceCardList)({
  flex: 1,
})

const FooterSpinner = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.xl,
}))
