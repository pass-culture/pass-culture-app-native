import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { getSpacing, Typo } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'

import { ModalIconProps } from './types'

type ModalHeaderProps = {
  title: string
  boldTitle?: boolean
  numberOfLines?: number
  onLayout?: (event: LayoutChangeEvent) => void
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  title,
  leftIcon: LeftIcon,
  leftIconAccessibilityLabel = 'leftIconButton',
  onLeftIconPress,
  rightIcon: RightIcon,
  rightIconAccessibilityLabel = 'rightIconButton',
  onRightIconPress,
  boldTitle = false,
  numberOfLines = 2,
  onLayout,
}) => {
  const TitleComponent = boldTitle ? BoldTitle : Title
  return (
    <HeaderContainer onLayout={onLayout}>
      <LeftHeaderActionContainer>
        <LeftHeaderAction
          onPress={onLeftIconPress}
          {...accessibilityAndTestId(leftIconAccessibilityLabel)}>
          {!!LeftIcon && <LeftIcon size={18} testID="leftIcon" />}
        </LeftHeaderAction>
      </LeftHeaderActionContainer>
      <TitleContainer>
        <TitleComponent numberOfLines={numberOfLines}>{title}</TitleComponent>
      </TitleContainer>
      <RightHeaderActionContainer>
        <RightHeaderAction
          onPress={onRightIconPress}
          {...accessibilityAndTestId(rightIconAccessibilityLabel)}>
          {!!RightIcon && <RightIcon size={18} testID="rightIcon" />}
        </RightHeaderAction>
      </RightHeaderActionContainer>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
})

const TitleContainer = styled.View({
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingRight: getSpacing(3),
  paddingLeft: getSpacing(3),
  flex: 0.8,
  zIndex: ZIndex.MODAL_HEADER,
})

const RightHeaderActionContainer = styled.View({
  paddingTop: getSpacing(0.5),
  flexDirection: 'row',
  flex: 0.1,
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
})

const LeftHeaderActionContainer = styled.View({
  flexDirection: 'row',
  paddingTop: getSpacing(0.5),
  flex: 0.1,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})

/* The negative margins are used to compensate for the
 "empty" space of SVG icons. */
const LeftHeaderAction = styled.TouchableOpacity({ marginLeft: -5 })
const RightHeaderAction = styled.TouchableOpacity({ marginRight: -5 })

const Title = styled(Typo.Title4)({ textAlign: 'center' })
const BoldTitle = styled(Typo.Title3)({ textAlign: 'center' })
