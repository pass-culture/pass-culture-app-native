import React, { ReactNode, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CustomKeyboardAvoidingView } from 'features/identityCheck/atoms/layout/CustomKeyboardAvoidingView'
import { useShouldEnableScrollOnView } from 'features/identityCheck/utils/useShouldEnableScrollView'
import { PageHeader } from 'ui/components/headers/PageHeader'
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
      <PageHeader
        title={props.title}
        background="primary"
        onGoBack={props.onGoBack}
        withGoBackButton
      />
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
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.primary,
}))

const FixedTopChildrenView = styled.View({
  paddingHorizontal: getSpacing(5),
  paddingTop: getSpacing(5),
})

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
