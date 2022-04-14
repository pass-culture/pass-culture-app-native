import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { theme } from 'theme'
import { IconInterface } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  wording: string
  type?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
}

export function ButtonInsideTextInner({ wording, type = 'ButtonText', icon: Icon, color }: Props) {
  const iconSize = type === 'Caption' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller
  const selectedColor = color ?? theme.colors.primary
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
      <StyledText type={type} color={selectedColor}>
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
  type?: string
  color?: ColorsEnum
  icon?: FunctionComponent<IconInterface>
}>(({ theme, type, color }) => ({
  ...(type === 'Caption' ? theme.typography.caption : theme.typography.buttonText),
  fontWeight: 'bold',
  color,
}))
