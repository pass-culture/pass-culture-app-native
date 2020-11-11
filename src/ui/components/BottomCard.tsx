import React, { FunctionComponent, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <AvoidingKeyboardContainer bottom={keyboardHeight}>
        <Background />
        <StyledFakeModal>{children}</StyledFakeModal>
      </AvoidingKeyboardContainer>
    </TouchableWithoutFeedback>
  )
}

interface AvoidingKeyboardContainerProps {
  bottom: number
}
const AvoidingKeyboardContainer = styled(View)<AvoidingKeyboardContainerProps>(({ bottom }) => ({
  bottom,
}))

const StyledFakeModal = styled.View({
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
