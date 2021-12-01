import React, { FunctionComponent } from 'react'
import { ViewStyle, TextStyle, StyleProp, LayoutChangeEvent } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { CSSObject } from 'styled-components'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'

import { isStyleObjectTypeGuard } from '../typeguards'

import { ModalIconProps } from './types'

export type ModalHeaderProps = {
  title: string
  boldTitle?: boolean
  customStyles?: ModalHeaderStyleClasses
  numberOfLines?: number
  onLayout?: (event: LayoutChangeEvent) => void
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  customStyles,
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
          {!!LeftIcon && (
            <LeftIcon size={32} testID="leftIcon" color={customStyles?.leftIcon?.color} />
          )}
        </LeftHeaderAction>
      </LeftHeaderActionContainer>
      <TitleContainer customStyle={customStyles?.container}>
        <TitleComponent customStyle={customStyles?.title} numberOfLines={numberOfLines}>
          {title}
        </TitleComponent>
      </TitleContainer>
      <RightHeaderActionContainer>
        <RightHeaderAction
          onPress={onRightIconPress}
          {...accessibilityAndTestId(rightIconAccessibilityLabel)}>
          {!!RightIcon && (
            <RightIcon size={32} testID="rightIcon" color={customStyles?.rightIcon?.color} />
          )}
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

const TitleContainer = styled.View<{ customStyle: StyleProp<ViewStyle> }>(({ customStyle }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingRight: getSpacing(3),
  paddingLeft: getSpacing(3),
  flex: 0.8,
  zIndex: ZIndex.MODAL_HEADER,
  ...(isStyleObjectTypeGuard(customStyle) ? (customStyle as Record<string, unknown>) : {}),
}))

const RightHeaderActionContainer = styled.View({
  flexDirection: 'row',
  flex: 0.1,
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
})

const LeftHeaderActionContainer = styled.View({
  flexDirection: 'row',
  flex: 0.1,
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
})

/* The negative margins are used to compensate for the
  "empty" space of SVG icons. */
const RightHeaderAction = styled.TouchableOpacity({
  marginRight: -5,
})

const LeftHeaderAction = styled.TouchableOpacity({
  marginLeft: -5,
})

const titleStyle = ({ customStyle }: { customStyle: StyleProp<ViewStyle> }) =>
  ({
    textAlign: 'center',
    ...(isStyleObjectTypeGuard(customStyle) ? (customStyle as Record<string, unknown>) : {}),
  } as CSSObject)

const Title = styled(Typo.Title4)<{
  customStyle: StyleProp<ViewStyle>
}>(titleStyle)

const BoldTitle = styled(Typo.Title3)<{
  customStyle: StyleProp<ViewStyle>
}>(titleStyle)

export interface ModalHeaderStyleClasses {
  container?: ViewStyle
  leftIcon?: {
    color?: ColorsEnum
  }
  title?: TextStyle
  rightIcon?: {
    color?: ColorsEnum
  }
}
