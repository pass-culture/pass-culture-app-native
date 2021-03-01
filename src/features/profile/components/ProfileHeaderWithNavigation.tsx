import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import {
  ModalHeader,
  ModalHeaderProps,
  ModalHeaderStyleClasses,
} from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing } from 'ui/theme'

interface Props extends Pick<ModalHeaderProps, 'title'> {
  onGoBack?: () => void
}

export function ProfileHeaderWithNavigation(props: Props) {
  const { goBack } = useNavigation()
  function onPress() {
    if (props.onGoBack) {
      props.onGoBack()
    }
    goBack()
  }
  return (
    <Container>
      <ModalHeader
        title={props.title}
        customStyles={modalHeaderStyles}
        onLeftIconPress={onPress}
        leftIcon={ArrowPrevious}
      />
    </Container>
  )
}

const Container = styled.View({
  minHeight: getSpacing(12) + getStatusBarHeight(true),
  maxHeight: getSpacing(14) + getStatusBarHeight(true),
  backgroundColor: ColorsEnum.PRIMARY,
})

const modalHeaderStyles: ModalHeaderStyleClasses = {
  container: {
    paddingHorizontal: getSpacing(4),
    position: 'absolute',
    bottom: getSpacing(1),
  },
  title: {
    color: ColorsEnum.WHITE,
    fontSize: 15,
  },
  leftIcon: {
    color: ColorsEnum.WHITE,
  },
}
