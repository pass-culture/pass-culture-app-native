import React, { FunctionComponent, ReactNode, useState } from 'react'
import { LayoutChangeEvent, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { CustomKeyboardAvoidingView } from 'ui/pages/components/CustomKeyboardAvoidingView'
import { useShouldEnableScrollOnView } from 'ui/pages/helpers/useShouldEnableScrollView'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

interface Props {
  title: string
  scrollChildren?: ReactNode
  fixedBottomChildren?: ReactNode
  onGoBack?: () => void
  shouldDisplayBackButton?: boolean
}

export const PageWithHeader: FunctionComponent<Props> = (props) => {
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
      />
      <CustomKeyboardAvoidingView>
        {props.scrollChildren ? (
          <ChildrenScrollView
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
      <BlurHeader height={headerHeight} />
    </Page>
  )
}

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
