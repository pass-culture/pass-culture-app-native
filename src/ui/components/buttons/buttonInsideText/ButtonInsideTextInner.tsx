import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { IconInterface } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  wording: string
  typography?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
}

export function ButtonInsideTextInner({
  wording,
  typography = 'ButtonText',
  icon: Icon,
  color,
}: Props) {
  const { icons, colors } = useTheme()
  const iconSize = typography === 'Caption' ? icons.sizes.extraSmall : icons.sizes.smaller
  const selectedColor = color ?? colors.primary
  return (
    <Container icon={Icon} iconSize={iconSize}>
      {!!Icon && (
        <IconContainer>
          <Icon
            {...accessibilityAndTestId(undefined, 'button-icon')}
            color={selectedColor}
            size={iconSize}
          />
          <Spacer.Row numberOfSpaces={1} />
        </IconContainer>
      )}
      <StyledText typography={typography} color={selectedColor}>
        {wording}
      </StyledText>
    </Container>
  )
}

const Container = styled.View<{
  icon?: FunctionComponent<IconInterface>
  iconSize: number
}>(({ icon, iconSize }) => ({
  paddingLeft: icon ? iconSize * 1.25 : undefined, // Hack for add space between icon and label
}))

const IconContainer = styled.View({
  position: 'absolute',
  left: 0,
})

const StyledText = styled.Text<{
  typography?: string
  color?: ColorsEnum
  icon?: FunctionComponent<IconInterface>
}>(({ theme, typography, color }) => ({
  ...(typography === 'Caption' ? theme.typography.caption : theme.typography.buttonText),
  fontWeight: 'bold',
  color,
}))
