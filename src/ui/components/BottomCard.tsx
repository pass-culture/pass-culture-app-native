import React, { FunctionComponent, useState } from 'react'
import { Keyboard, View } from 'react-native'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { ColorsEnum, getShadow, getSpacing, Spacer } from 'ui/theme'

import { AvoidingKeyboardContainer } from './keyboard'

export const BottomCard: FunctionComponent = ({ children }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useKeyboardEvents({
    onBeforeShow(data) {
      if (data.keyboardShown) {
        setKeyboardHeight(data.keyboardHeight)
      }
    },
    onBeforeHide(data) {
      if (!data.keyboardShown) {
        setKeyboardHeight(0)
      }
    },
  })

  return (
    <StyledTouchableWithoutFeedback>
      <AvoidingKeyboardContainer keyboardHeight={keyboardHeight}>
        <StyledBottomCardContainer>
          {children}
          <Spacer.BottomScreen />
        </StyledBottomCardContainer>
      </AvoidingKeyboardContainer>
    </StyledTouchableWithoutFeedback>
  )
}

const StyledTouchableWithoutFeedback = styled(View).attrs({
  onPress: Keyboard.dismiss,
})({
  position: 'absolute',
  bottom: 0,
  width: '100%',
})

const StyledBottomCardContainer = styled.View({
  position: 'absolute',
  bottom: 0,
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
