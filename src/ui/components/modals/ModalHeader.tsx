import React, { FunctionComponent } from 'react'
import { ViewStyle, TextStyle, StyleProp } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { CSSObject } from 'styled-components'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Typo } from 'ui/theme'

import { isStyleObjectTypeGuard } from '../typeguards'

export interface ModalHeaderProps {
  title: string
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress?: () => void
  boldTitle?: boolean
  customStyles?: ModalHeaderStyleClasses
}

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  customStyles,
  title,
  leftIcon: LeftIcon,
  onLeftIconPress,
  rightIcon: RightIcon,
  onRightIconPress,
  boldTitle = false,
}) => {
  const TitleComponent = boldTitle ? BoldTitle : Title
  return (
    <Container>
      <LeftHeaderAction onPress={onLeftIconPress} testID="leftIconButton">
        {LeftIcon && <LeftIcon size={32} testID="leftIcon" color={customStyles?.leftIcon?.color} />}
      </LeftHeaderAction>
      <TitleComponent customStyle={customStyles?.title} numberOfLines={2}>
        {title}
      </TitleComponent>
      <RightHeaderAction onPress={onRightIconPress} testID="rightIconButton">
        {RightIcon && (
          <RightIcon size={32} testID="rightIcon" color={customStyles?.rightIcon?.color} />
        )}
      </RightHeaderAction>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

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

const titleStyle = ({ customStyle }: { customStyle: StyleProp<ViewStyle> }) =>
  ({
    flex: 0.6,
    textAlign: 'center',
    ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
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
