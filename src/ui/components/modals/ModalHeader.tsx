import React, { FunctionComponent } from 'react'
import { TextStyle, ViewStyle, StyleProp } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

import { isStyleObject } from '../typeguards'

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
    <HeaderAction onPress={onLeftIconPress} testID="leftIconButton">
      {LeftIcon && <LeftIcon size={32} testID="leftIcon" />}
    </HeaderAction>
    <Title customStyle={customStyles?.title}>
      <Typo.Title4 numberOfLines={2}>{title}</Typo.Title4>
    </Title>
    <HeaderAction onPress={onRightIconPress} testID="rightIconButton">
      {RightIcon && <RightIcon size={32} testID="rightIcon" />}
    </HeaderAction>
  </DynamicContainer>
)

const DynamicContainer = styled.View<{
  customStyle: StyleProp<ViewStyle>
}>(({ customStyle }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  ...(isStyleObject(customStyle) ? customStyle : null),
}))

const HeaderAction = styled.TouchableOpacity({
  flex: 0.2,
  alignItems: 'center',
})

const Title = styled.Text<{
  customStyle: StyleProp<ViewStyle>
}>(({ customStyle }) => ({
  flex: 0.6,
  textAlign: 'center',
  ...(isStyleObject(customStyle) ? customStyle : null),
}))

export interface ModalHeaderStyleClasses {
  container?: ViewStyle
  leftSide?: ViewStyle
  title?: TextStyle
  rightSide?: ViewStyle
}
