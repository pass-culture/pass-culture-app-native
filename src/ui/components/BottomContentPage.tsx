import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getShadow, getSpacing, Spacer } from 'ui/theme'

import { AvoidingKeyboardContainer } from './keyboard'

interface Props {
  onKeyboardDismiss?: () => void
  // used to communicate the keyboard height to the parent without triggering a rerendering
  keyboardHeightRef?: MutableRefObject<number>
}

export const BottomContentPage: FC<Props> = (props) => {
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

  return (
    <React.Fragment>
      <Background />
      <Container>
        <AvoidingKeyboardContainer keyboardHeight={keyboardHeight}>
          <StyledBottomCardContainer>
            {props.children}
            <Spacer.BottomScreen />
          </StyledBottomCardContainer>
        </AvoidingKeyboardContainer>
      </Container>
    </React.Fragment>
  )
}

const Container = styled(View).attrs({
  onPress: Keyboard.dismiss,
})({
  zIndex: 41,
  position: 'absolute',
  bottom: 0,
  width: '100%',
})

const StyledBottomCardContainer = styled.View({
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: getSpacing(6),
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  backgroundColor: `${ColorsEnum.WHITE}`,
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

export const BottomCardContentContainer = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
