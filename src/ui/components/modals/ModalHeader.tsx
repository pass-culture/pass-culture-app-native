import React, { FunctionComponent } from 'react'
import { TextStyle, ViewStyle, StyleProp } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

import { isStyleObjectTypeGuard } from '../typeguards'

interface Props {
  title: string
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress?: () => void
  customStyles?: ModalHeaderStyleClasses
}

export const ModalHeader: FunctionComponent<Props> = ({
  customStyles,
  title,
  leftIcon: LeftIcon,
  onLeftIconPress,
  rightIcon: RightIcon,
  onRightIconPress,
}) => (
  <DynamicContainer customStyle={customStyles?.container}>
    <LeftHeaderAction onPress={onLeftIconPress} testID="leftIconButton">
      {LeftIcon && <LeftIcon size={32} testID="leftIcon" />}
    </LeftHeaderAction>
    <Title customStyle={customStyles?.title}>
      <Typo.Title4 numberOfLines={2}>{title}</Typo.Title4>
    </Title>
    <RightHeaderAction onPress={onRightIconPress} testID="rightIconButton">
      {RightIcon && <RightIcon size={32} testID="rightIcon" />}
    </RightHeaderAction>
  </DynamicContainer>
)

const DynamicContainer = styled.View<{
  customStyle: StyleProp<ViewStyle>
}>(({ customStyle }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
}))

/* The negative margins are used to compensate for the
  "empty" space of SVG icons. */
const RightHeaderAction = styled.TouchableOpacity({
  flex: 0.2,
  marginRight: -4,
  alignItems: 'flex-end',
})
const LeftHeaderAction = styled.TouchableOpacity({
  flex: 0.2,
  marginLeft: -4,
  alignItems: 'flex-start',
})

const Title = styled.Text<{
  customStyle: StyleProp<ViewStyle>
}>(({ customStyle }) => ({
  flex: 0.6,
  textAlign: 'center',
  ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
}))

export interface ModalHeaderStyleClasses {
  container?: ViewStyle
  leftSide?: ViewStyle
  title?: TextStyle
  rightSide?: ViewStyle
}
