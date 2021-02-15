import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import {
  ModalHeader,
  ModalHeaderProps,
  ModalHeaderStyleClasses,
} from 'ui/components/modals/ModalHeader'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, ScreenWidth } from 'ui/theme'

export function HeaderWithNavigation(props: Pick<ModalHeaderProps, 'title'>) {
  const { goBack } = useNavigation()
  return (
    <HeaderBackgroundWrapper>
      <HeaderBackground width={ScreenWidth} />
      <ModalHeader
        title={props.title}
        customStyles={modalHeaderStyles}
        onLeftIconPress={goBack}
        leftIcon={ArrowPrevious}
      />
    </HeaderBackgroundWrapper>
  )
}

const HeaderBackgroundWrapper = styled.View({
  maxHeight: getSpacing(16) + getStatusBarHeight(true),
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
})

const modalHeaderStyles: ModalHeaderStyleClasses = {
  container: {
    paddingHorizontal: getSpacing(4),
    position: 'absolute',
    bottom: getSpacing(3),
  },
  title: {
    color: ColorsEnum.WHITE,
  },
  leftIcon: {
    color: ColorsEnum.WHITE,
  },
}
