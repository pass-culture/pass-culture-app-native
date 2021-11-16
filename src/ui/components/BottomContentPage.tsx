import React, { FC, MutableRefObject, useEffect, useState, useMemo } from 'react'
import { Keyboard, View, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getShadow, getSpacing, Spacer } from 'ui/theme'

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
  const theme = useTheme()
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
  }, [keyboardHeight])

  const Layout = useMemo(() => {
    const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)(
      theme.isMobileViewport ? {} : { flex: 1 }
    )
    const StyledBottomCardContainer = styled.ScrollView.attrs<{ customPaddingBottom: number }>(
      ({ theme }) => ({
        contentContainerStyle: {
          width: '100%',
          padding: getSpacing(6),
          borderTopLeftRadius: getSpacing(4),
          borderTopRightRadius: getSpacing(4),
          backgroundColor: `${ColorsEnum.WHITE}`,
          alignItems: 'center',
          flexDirection: 'column',
          paddingBottom: getCorrectPadding(keyboardHeight),
          ...(theme.isMobileViewport
            ? {}
            : {
                marginTop: theme.bottomContentPage.offsetTopHeightDesktopTablet,
                flexGrow: 1,
              }),
        },
      })
    )({
      ...getShadow({
        shadowOffset: {
          width: 0,
          height: getSpacing(2),
        },
        shadowRadius: getSpacing(1),
        shadowColor: ColorsEnum.BLACK,
        shadowOpacity: 0.15,
      }),
    })

    const SCALE_HEIGHT_RATIO = 1.75
    const StyledBackground = () => (
      <Background
        height={
          theme.isMobileViewport
            ? undefined
            : theme.bottomContentPage.offsetTopHeightDesktopTablet * SCALE_HEIGHT_RATIO
        }
      />
    )

    return {
      Background: StyledBackground,
      BottomCardContainer: StyledBottomCardContainer,
      KeyboardAvoidingView: StyledKeyboardAvoidingView,
    }
  }, [theme.bottomContentPage.offsetTopHeightDesktopTablet, theme.isMobileViewport, keyboardHeight])

  return (
    <BottomContentPageContainer>
      <Layout.Background />
      <Container>
        <Layout.KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Layout.BottomCardContainer
            scrollEnabled={keyboardHeight !== 0}
            keyboardShouldPersistTaps="handled">
            {props.children}
            <Spacer.BottomScreen />
          </Layout.BottomCardContainer>
        </Layout.KeyboardAvoidingView>
      </Container>
    </BottomContentPageContainer>
  )
}

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

export const BottomCardContentContainer = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
