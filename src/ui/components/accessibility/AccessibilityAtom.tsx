import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ValidationMark as DefaultValidationMark } from 'ui/components/ValidationMark'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { getIconAndWording, HandicapCategory } from './AccessibilityAtom.service'
interface Props {
  handicap: HandicapCategory
  isAccessible: boolean
}

export const AccessibilityAtom: React.FC<Props> = ({ handicap, isAccessible }) => {
  const { Icon, wording } = getIconAndWording(handicap)
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  const isAccessibleLabel = isAccessible ? 'Accessible' : 'Non accessible'
  return (
    <Container
      accessibilityRole={AccessibilityRole.IMAGE}
      testID="accessibilityAtomContainer"
      accessibilityLabel={`${wording}\u00a0: ${isAccessibleLabel}`}>
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
      <StyledCaption>{wording}</StyledCaption>
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const Frame = styled.View(({ theme }) => ({
  height: getSpacing(12),
  width: getSpacing(12),
  alignItems: 'center',
  borderColor: theme.colors.greyMedium,
  borderRadius: theme.borderRadius.radius,
  borderWidth: 1,
}))

const StyledCaption = styled(Typo.Caption)({ textAlign: 'center', paddingHorizontal: 1 })

const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(2),
})

const ValidationMark = styled(DefaultValidationMark).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
