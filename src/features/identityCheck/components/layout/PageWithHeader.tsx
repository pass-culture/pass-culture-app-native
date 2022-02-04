import React, { ReactNode, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CustomKeyboardAvoidingView } from 'features/identityCheck/atoms/layout/CustomKeyboardAvoidingView'
import { PageHeader } from 'features/identityCheck/atoms/layout/PageHeader'
import { useShouldEnableScrollOnView } from 'features/identityCheck/utils/useShouldEnableScrollView'
import { Background } from 'ui/svg/Background'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  title: string
  fixedTopChildren?: ReactNode
  scrollChildren?: ReactNode
  fixedBottomChildren?: ReactNode
  onGoBack?: () => void
}

export const PageWithHeader = (props: Props) => {
  const { onScrollViewLayout, onScrollViewContentSizeChange } = useShouldEnableScrollOnView()

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  function onFixedBottomChildrenViewLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }

  return (
    <Container>
      <Spacer.TopScreen />
      <PageHeader title={props.title} onGoBack={props.onGoBack} />
      <CustomKeyboardAvoidingView>
        {props.fixedTopChildren ? (
          <FixedTopChildrenView>{props.fixedTopChildren}</FixedTopChildrenView>
        ) : null}
        {props.scrollChildren ? (
          <ChildrenScrollView
            bottomChildrenViewHeight={bottomChildrenViewHeight}
            onContentSizeChange={onScrollViewContentSizeChange}
            onLayout={onScrollViewLayout}>
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
      <Background />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

const FixedTopChildrenView = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingTop: getSpacing(5),
})

type ChildrenScrollViewProps = { bottomChildrenViewHeight: number }
const ChildrenScrollView = styled.ScrollView.attrs<ChildrenScrollViewProps>((props) => ({
  keyboardShouldPersistTaps: 'handled',
  keyboardDismissMode: 'on-drag',
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
