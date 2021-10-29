import React, { FunctionComponent } from 'react'
import { ViewStyle, TextStyle, StyleProp } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { CSSObject } from 'styled-components'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ColorsEnum, Typo } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'

import { isStyleObjectTypeGuard } from '../typeguards'

import { ModalIconProps } from './types'

export type ModalHeaderProps = {
  title: string
  boldTitle?: boolean
  customStyles?: ModalHeaderStyleClasses
  numberOfLines?: number
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
}) => {
  const TitleComponent = boldTitle ? BoldTitle : Title
  return (
    <Container customStyle={customStyles?.container}>
      <LeftHeaderAction
        onPress={onLeftIconPress}
        {...accessibilityAndTestId(leftIconAccessibilityLabel)}>
        {!!LeftIcon && (
          <LeftIcon size={32} testID="leftIcon" color={customStyles?.leftIcon?.color} />
        )}
      </LeftHeaderAction>
      <TitleComponent customStyle={customStyles?.title} numberOfLines={numberOfLines}>
        {title}
      </TitleComponent>
      <RightHeaderAction
        onPress={onRightIconPress}
        {...accessibilityAndTestId(rightIconAccessibilityLabel)}>
        {!!RightIcon && (
          <RightIcon size={32} testID="rightIcon" color={customStyles?.rightIcon?.color} />
        )}
      </RightHeaderAction>
    </Container>
  )
}

const Container = styled.View<{ customStyle: StyleProp<ViewStyle> }>(({ customStyle }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  zIndex: ZIndex.MODAL_HEADER,
  ...(isStyleObjectTypeGuard(customStyle) ? (customStyle as Record<string, unknown>) : {}),
}))

/* The negative margins are used to compensate for the
  "empty" space of SVG icons. */
const RightHeaderAction = styled.TouchableOpacity({
  flex: 0.1,
  marginRight: -4,
  alignItems: 'flex-end',
})
const LeftHeaderAction = styled.TouchableOpacity({
  flex: 0.1,
  marginLeft: -4,
  alignItems: 'flex-start',
})

const titleStyle = ({ customStyle }: { customStyle: StyleProp<ViewStyle> }) =>
  ({
    flex: 0.8,
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
