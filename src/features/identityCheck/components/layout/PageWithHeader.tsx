import React, { ReactNode, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CustomKeyboardAvoidingView } from 'features/identityCheck/atoms/layout/CustomKeyboardAvoidingView'
import { PageHeader } from 'features/identityCheck/atoms/layout/PageHeader'
import { useShouldEnableScrollOnView } from 'features/identityCheck/utils/useShouldEnableScrollView'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface Props {
  title: string
  fixedTopChildren?: ReactNode
  scrollChildren?: ReactNode
  fixedBottomChildren?: ReactNode
}

export const PageWithHeader = (props: Props) => {
  const {
    isScrollEnabled,
    onScrollViewLayout,
    onScrollViewContentSizeChange,
  } = useShouldEnableScrollOnView()

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  return (
    <Container>
      <Spacer.TopScreen />
      <PageHeader title={props.title} />
      <CustomKeyboardAvoidingView>
          {props.fixedTopChildren}
        <ChildrenScrollView
          bottomChildrenViewHeight={bottomChildrenViewHeight}
          onContentSizeChange={onScrollViewContentSizeChange}
          onLayout={onScrollViewLayout}
          scrollEnabled={isScrollEnabled}>
          {props.scrollChildren}
        </ChildrenScrollView>
        <FixedBottomChildrenView
          onLayout={onFixedBottomChildrenViewLayout}
          testID="fixed-bottom-children">
          {props.fixedBottomChildren}
        </FixedBottomChildrenView>
      </CustomKeyboardAvoidingView>
      <Background />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

const FixedBottomChildrenView = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: getSpacing(5),
  paddingTop: getSpacing(3),
  backgroundColor: ColorsEnum.WHITE,
})

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled.ScrollView.attrs<ChildrenScrollViewProps>((props) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingBottom: props.bottomChildrenViewHeight,
  },
}))<ChildrenScrollViewProps>({})
