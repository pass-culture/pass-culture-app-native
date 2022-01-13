import React from 'react'
import styled from 'styled-components/native'

import { ValidationMark } from 'ui/components/ValidationMark'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { getIconAndWording, HandicapCategory } from './AccessibilityAtom.service'
interface Props {
  handicap: HandicapCategory
  isAccessible: boolean
  rightSpacingValue?: number
}

export const AccessibilityAtom: React.FC<Props> = ({
  handicap,
  isAccessible,
  rightSpacingValue = 0,
}) => {
  const { Icon, wording } = getIconAndWording(handicap)

  return (
    <Container rightSpacingValue={rightSpacingValue} testID="accessibilityAtomContainer">
      <Frame testID="accessibilityFrame">
        <Spacer.Flex />
        <Icon size={getSpacing(8)} />
        <Spacer.Flex />
        <ValidationContainer>
          <ValidationMark
            isValid={isAccessible}
            size={getSpacing(6)}
            invalidTestID="invalidTestId"
            validtestID="validTestId"
          />
        </ValidationContainer>
      </Frame>
      <Spacer.Column numberOfSpaces={4} />
      <TextContainer testID={wording}>
        <Text>{wording}</Text>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View<{ rightSpacingValue: number }>(({ rightSpacingValue, theme }) => ({
  flex: 1,
  marginRight: rightSpacingValue,
  alignItems: theme.isMobileViewport ? undefined : 'center',
}))

const Frame = styled.View({
  aspectRatio: '1',
  alignItems: 'center',
  borderColor: ColorsEnum.GREY_MEDIUM,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  borderWidth: 1,
  minHeight: getSpacing(16),
})

const TextContainer = styled.View({
  marginHorizontal: -getSpacing(1),
  marginBottom: getSpacing(4),
})

const Text = styled(Typo.Caption)({ textAlign: 'center', paddingHorizontal: 1 })

const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(3),
})
