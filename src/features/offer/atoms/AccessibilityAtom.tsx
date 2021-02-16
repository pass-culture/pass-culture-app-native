import React from 'react'
import styled from 'styled-components/native'

import { ValidationMark } from 'ui/components/ValidationMark'
import { useElementWidth } from 'ui/hooks/useElementWidth'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { getIconAndWording, HandicapCategory } from './AccessibilityAtom.service'

const HandicapText: React.FC<{ wording: string; width: number }> = ({ wording, width }) => {
  const [firstWord, ...otherWords] = wording.split(' ')

  return (
    <TextContainer testID={wording} width={width}>
      <Text numberOfLines={1} adjustsFontSizeToFit={true}>
        {firstWord}
      </Text>
      {otherWords.map((word) => (
        <React.Fragment key={word}>
          <Text> </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit={true}>
            {word}
          </Text>
        </React.Fragment>
      ))}
    </TextContainer>
  )
}

interface Props {
  handicap: HandicapCategory
  isAccessible: boolean
  sideSpace: number
}

export const AccessibilityAtom: React.FC<Props> = ({ handicap, isAccessible, sideSpace }) => {
  const { Icon, wording } = getIconAndWording(handicap)
  const { width, onLayout } = useElementWidth()

  return (
    <Container>
      <Frame testID="accessibilityFrame" onLayout={onLayout}>
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
      <HandicapText wording={wording} width={(width ?? 0) + sideSpace} />
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
const Text = styled(Typo.Caption)({ textAlign: 'center' })
const TextContainer = styled.View<{ width: number }>(({ width }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width,
  alignSelf: 'center',
  marginHorizontal: getSpacing(2),
}))
const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(4),
})
