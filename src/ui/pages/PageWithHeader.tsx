import React, { forwardRef, ReactNode, useState } from 'react'
import { LayoutChangeEvent, Platform, ScrollView, ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { CustomKeyboardAvoidingView } from 'ui/pages/components/CustomKeyboardAvoidingView'
import { useShouldEnableScrollOnView } from 'ui/pages/helpers/useShouldEnableScrollView'
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
}
const isWeb = Platform.OS === 'web'
export const PageWithHeader = forwardRef<ScrollView, Props>((props, ref) => {
  const headerHeight = useGetHeaderHeight()

  const { onScrollViewLayout, onScrollViewContentSizeChange } = useShouldEnableScrollOnView()

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)
  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  return (
    <Page>
      <PageHeaderWithoutPlaceholder
        title={props.title}
        onGoBack={props.onGoBack}
        shouldDisplayBackButton={props.shouldDisplayBackButton}
        RightButton={props.RightButton}
      />
      <CustomKeyboardAvoidingView
        shouldBeAlignedFlexStart={isWeb && props.shouldBeAlignedFlexStart}>
        {props.scrollChildren ? (
          <ChildrenScrollView
            ref={ref}
            {...props.scrollViewProps}
            bottomChildrenViewHeight={bottomChildrenViewHeight}
            onContentSizeChange={onScrollViewContentSizeChange}
            onLayout={onScrollViewLayout}>
            <View style={{ height: headerHeight }} />
            {props.scrollChildren}
          </ChildrenScrollView>
        ) : null}
        {props.fixedBottomChildren ? (
          <FixedBottomChildrenView onLayout={onFixedBottomChildrenViewLayout}>
            {props.fixedBottomChildren}
            <Spacer.BottomScreen />
          </FixedBottomChildrenView>
        ) : null}
      </CustomKeyboardAvoidingView>
    </Page>
  )
})
PageWithHeader.displayName = 'PageWithHeader'

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled(ScrollView).attrs<ChildrenScrollViewProps>(
  ({ theme, bottomChildrenViewHeight }) => ({
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flexGrow: 1,
      flexDirection: 'column',
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
