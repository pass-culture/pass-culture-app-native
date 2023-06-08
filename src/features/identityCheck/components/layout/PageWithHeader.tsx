import React, { FunctionComponent, ReactNode, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { CustomKeyboardAvoidingView } from 'features/identityCheck/components/CustomKeyboardAvoidingView'
import { useShouldEnableScrollOnView } from 'features/identityCheck/components/layout/helpers/useShouldEnableScrollView'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  title: string
  scrollChildren?: ReactNode
  fixedBottomChildren?: ReactNode
  onGoBack?: () => void
}

export const PageWithHeader: FunctionComponent<Props> = (props) => {
  const { onScrollViewLayout, onScrollViewContentSizeChange } = useShouldEnableScrollOnView()

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  const headerHeight = useGetHeaderHeight()

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={props.title} onGoBack={props.onGoBack} />
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
      <BlurHeaderContainer height={headerHeight}>
        <BlurHeader />
      </BlurHeaderContainer>
    </React.Fragment>
  )
}

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled.ScrollView.attrs<ChildrenScrollViewProps>((props) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingBottom: props.bottomChildrenViewHeight,
    paddingHorizontal: getSpacing(5),
  },
}))<ChildrenScrollViewProps>({})

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: getSpacing(5),
  paddingTop: getSpacing(3),
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(5),
}))

const BlurHeaderContainer = styled.View<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
}))
