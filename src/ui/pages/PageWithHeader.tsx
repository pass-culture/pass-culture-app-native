import React, { forwardRef, ReactNode, useState } from 'react'
import { LayoutChangeEvent, Platform, ScrollView, ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { Gradient } from 'ui/components/Gradient'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { CustomKeyboardAvoidingView } from 'ui/pages/components/CustomKeyboardAvoidingView'
import { useShouldEnableScrollOnView } from 'ui/pages/helpers/useShouldEnableScrollView'
import { useStickyFooterGradient } from 'ui/pages/helpers/useStickyFooterGradient'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

interface Props {
  title: string
  onGoBack?: () => void
  scrollChildren?: ReactNode
  fixedBottomChildren?: ReactNode
  shouldDisplayBackButton?: boolean
  RightButton?: ReactNode
  shouldBeAlignedFlexStart?: boolean
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>
  shouldDisplayBottomGradient?: boolean
}
const isWeb = Platform.OS === 'web'
export const PageWithHeader = forwardRef<ScrollView, Props>((props, ref) => {
  const { onScrollViewLayout, onScrollViewContentSizeChange } = useShouldEnableScrollOnView()
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0)
  const headerHeight = useGetHeaderHeight()
  const {
    gradientRef,
    bottomChildrenViewHeight,
    onFixedBottomChildrenViewLayout,
    onChildrenScrollViewLayout,
    onChildrenScrollViewContentSizeChange,
    onChildrenScrollViewScroll,
  } = useStickyFooterGradient({
    hasFixedBottomChildren: Boolean(props.fixedBottomChildren),
    scrollViewProps: props.scrollViewProps,
    onScrollViewLayout,
    onScrollViewContentSizeChange,
  })

  function onHeaderLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setMeasuredHeaderHeight(height)
  }

  const paddingHeaderHeight = useFontScaleValue({
    default: headerHeight,
    at200PercentZoom: measuredHeaderHeight,
  })

  return (
    <Page>
      <PageHeaderWithoutPlaceholder
        title={props.title}
        onGoBack={props.onGoBack}
        shouldDisplayBackButton={props.shouldDisplayBackButton}
        RightButton={props.RightButton}
        onLayout={onHeaderLayout}
      />
      <CustomKeyboardAvoidingView
        shouldBeAlignedFlexStart={isWeb && props.shouldBeAlignedFlexStart}>
        {props.scrollChildren ? (
          <ChildrenScrollView
            ref={ref}
            {...props.scrollViewProps}
            bottomChildrenViewHeight={bottomChildrenViewHeight}
            paddingHeaderHeight={paddingHeaderHeight}
            onContentSizeChange={onChildrenScrollViewContentSizeChange}
            onLayout={onChildrenScrollViewLayout}
            onScroll={onChildrenScrollViewScroll}
            scrollEventThrottle={16}>
            {props.scrollChildren}
          </ChildrenScrollView>
        ) : null}
        {props.fixedBottomChildren ? (
          <React.Fragment>
            <Gradient ref={gradientRef} bottomViewHeight={bottomChildrenViewHeight} />
            <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
              {props.fixedBottomChildren}
              <Spacer.BottomScreen />
            </FixedBottomChildrenView>
          </React.Fragment>
        ) : null}
      </CustomKeyboardAvoidingView>
    </Page>
  )
})
PageWithHeader.displayName = 'PageWithHeader'

type ChildrenScrollViewProps = {
  bottomChildrenViewHeight: number
  paddingHeaderHeight: number
} & Omit<ScrollViewProps, 'contentContainerStyle'>

const ChildrenScrollView = styled(ScrollView).attrs<ChildrenScrollViewProps>(
  ({ theme, bottomChildrenViewHeight, paddingHeaderHeight }) => ({
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flexGrow: 1,
      flexDirection: 'column',
      paddingTop: paddingHeaderHeight,
      paddingBottom: bottomChildrenViewHeight,
      paddingHorizontal: theme.contentPage.marginHorizontal,
    },
  })
)<ChildrenScrollViewProps>({})

const FixedBottomChildrenView = styled(View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: theme.designSystem.size.spacing.xl,
  paddingTop: theme.designSystem.size.spacing.m,
  backgroundColor: theme.designSystem.color.background.default,
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))
