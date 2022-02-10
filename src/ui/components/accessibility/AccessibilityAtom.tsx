import React from 'react'
import styled from 'styled-components/native'

import { ValidationMark as DefaultValidationMark } from 'ui/components/ValidationMark'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.standard,
  }))``

  return (
    <Container rightSpacingValue={rightSpacingValue} testID="accessibilityAtomContainer">
      <Frame testID="accessibilityFrame">
        <Spacer.Flex />
        <StyledIcon />
        <Spacer.Flex />
        <ValidationContainer>
          <ValidationMark
            isValid={isAccessible}
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
  alignItems: theme.isMobileViewport && theme.isTouch ? undefined : 'center',
}))

const Frame = styled.View(({ theme }) => ({
  aspectRatio: '1',
  alignItems: 'center',
  borderColor: theme.colors.greyMedium,
  borderRadius: theme.borderRadius.radius,
  borderWidth: 1,
  minHeight: getSpacing(16),
}))

const TextContainer = styled.View({
  marginHorizontal: -getSpacing(1),
  marginBottom: getSpacing(4),
})

const Text = styled(Typo.Caption)({ textAlign: 'center', paddingHorizontal: 1 })

const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(3),
})

const ValidationMark = styled(DefaultValidationMark).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
