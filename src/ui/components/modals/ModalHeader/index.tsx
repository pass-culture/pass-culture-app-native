import React, { FunctionComponent } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { IconInterface } from 'ui/icons/types'
import { Typo } from 'ui/theme'

import { ModalHeaderStyleClasses, ModalHeaderStyles } from './styles'

interface Props {
  title: string
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress?: () => void
  classes?: ModalHeaderStyleClasses
}

const ModalHeader: FunctionComponent<Props> = ({
  classes,
  title,
  leftIcon: LeftIcon,
  onLeftIconPress,
  rightIcon: RightIcon,
  onRightIconPress,
}) => {
  return (
    <View style={[ModalHeaderStyles.container, classes?.container]}>
      <TouchableOpacity
        style={ModalHeaderStyles.leftSide}
        onPress={onLeftIconPress}
        testID="leftIconButton">
        {LeftIcon && <LeftIcon size={32} testID="leftIcon" />}
      </TouchableOpacity>
      <Text style={[ModalHeaderStyles.title, classes?.title]}>
        <Typo.Title4 numberOfLines={2}>{title}</Typo.Title4>
      </Text>
      <TouchableOpacity
        style={ModalHeaderStyles.rightSide}
        onPress={onRightIconPress}
        testID="rightIconButton">
        {RightIcon && <RightIcon size={32} testID="rightIcon" />}
      </TouchableOpacity>
    </View>
  )
}

export default ModalHeader
