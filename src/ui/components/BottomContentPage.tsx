import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Keyboard, View, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { useStatusBarWhite } from 'libs/hooks/useStatusBarWhite'
import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Background } from 'ui/svg/Background'
import { getShadow, getSpacing, Spacer } from 'ui/theme'

const getCorrectPadding = (keyboardHeight: number) => {
  if (Platform.OS === 'ios') {
    if (keyboardHeight !== 0) {
      return 50
    } else {
      return 16
    }
  } else {
    return 20
  }
}
interface Props {
  onKeyboardDismiss?: () => void
  // used to communicate the keyboard height to the parent without triggering a rerendering
  keyboardHeightRef?: MutableRefObject<number>
}

export const BottomContentPage: FC<Props> = (props) => {
  useStatusBarWhite()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useKeyboardEvents({
    onBeforeShow(data) {
      setKeyboardHeight(data.keyboardHeight)
    },
    onBeforeHide() {
      setKeyboardHeight(0)
      props.onKeyboardDismiss?.()
    },
  })

  // effect that informs the parent that the keyboard height has changed
  // the parent won't rerender
  useEffect(() => {
    if (!props.keyboardHeightRef) {
      return
    }

    props.keyboardHeightRef.current = keyboardHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardHeight])

  return (
    <BottomContentPageContainer>
      <BottomContentPageBackground />
      <Container>
        <StyledKeyboardAvoidingView>
          <StyledBottomCardContainer
            customPaddingBottom={getCorrectPadding(keyboardHeight)}
            scrollEnabled={keyboardHeight !== 0}
            keyboardShouldPersistTaps="handled">
            {props.children}
            <Spacer.BottomScreen />
          </StyledBottomCardContainer>
        </StyledKeyboardAvoidingView>
      </Container>
    </BottomContentPageContainer>
  )
}

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})(({ theme }) => (theme.showTabBar ? {} : { flex: 1 }))

const BottomContentPageContainer = styled(SafeAreaView)({
  height: '100%',
})

const Container = styled(View).attrs({
  onPress: Keyboard.dismiss,
})({
  width: '100%',
  height: '100%',
  justifyContent: 'flex-end',
})

const StyledBottomCardContainer = styled.ScrollView.attrs<{ customPaddingBottom: number }>(
  ({ customPaddingBottom, theme }) => ({
    contentContainerStyle: {
      width: '100%',
      padding: getSpacing(6),
      borderTopLeftRadius: getSpacing(4),
      borderTopRightRadius: getSpacing(4),
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      flexDirection: 'column',
      paddingBottom: customPaddingBottom,
      ...(theme.showTabBar
        ? {}
        : {
            marginTop: theme.contentPage.bottom.offsetTopHeightDesktopTablet,
            flexGrow: 1,
          }),
    },
  })
)<{ customPaddingBottom: number }>(({ theme }) => ({
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const SCALE_HEIGHT_RATIO = 1.75
const BottomContentPageBackground = styled(Background).attrs(
  ({ theme: { showTabBar, contentPage } }) => ({
    height: showTabBar
      ? undefined
      : contentPage.bottom.offsetTopHeightDesktopTablet * SCALE_HEIGHT_RATIO,
  })
)({})
