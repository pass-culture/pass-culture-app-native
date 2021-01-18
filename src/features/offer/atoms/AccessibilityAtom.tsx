import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { _ } from '../../../libs/i18n'
import { ValidationMark } from '../../../ui/components/ValidationMark'

import { getIconAndWording } from './AccessibilityAtom.service'

export enum HandicapCategory {
  'VISUAL',
  'MENTAL',
  'MOTOR',
  'AUDIO',
}
interface Props {
  handicap: HandicapCategory
  isAccessible: boolean
  sideSpace: number
}

export const AccessibilityAtom: React.FC<Props> = ({ handicap, isAccessible, sideSpace }) => {
  const { Icon, wording } = getIconAndWording(handicap)
  const [width, setWidth] = useState<number | undefined>(undefined)
  return (
    <Container>
      <Frame
        testID="accessibilityFrame"
        onLayout={(event: LayoutChangeEvent) => {
          setWidth(event.nativeEvent.layout.width)
        }}>
        <Spacer.Flex />
        <Icon size={getSpacing(12)} />
        <Spacer.Flex />
        <ValidationContainer>
          <ValidationMark
            isValid={isAccessible}
            size={getSpacing(8)}
            invalidTestID="invalidTestId"
            validtestID="validTestId"
          />
        </ValidationContainer>
      </Frame>
      <Spacer.Column numberOfSpaces={4} />
      <TextContainer testID="textContainer" width={(width ?? 0) + sideSpace}>
        <Text numberOfLines={2}>{wording}</Text>
      </TextContainer>
    </Container>
  )
}

const Frame = styled.View({
  aspectRatio: '1',
  alignItems: 'center',
  borderColor: ColorsEnum.GREY_MEDIUM,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  borderWidth: 1,
})

const Container = styled.View({
  flexDirection: 'column',
  flexShrink: 1,
})
const Text = styled(Typo.Caption)({
  textAlign: 'center',
})
const TextContainer = styled.View<{ width: number }>(({ width }) => ({
  width,
  alignSelf: 'center',
  paddingHorizontal: getSpacing(1),
}))
const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(4),
})
