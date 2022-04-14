import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { theme } from 'theme'
import { AppButtonEventNative, AppButtonEventWeb } from 'ui/components/buttons/AppButton/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  wording: string
  type?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
}

export function ButtonInsideText({
  wording,
  type = 'ButtonText',
  onPress,
  onLongPress,
  icon: Icon,
  color,
}: Props) {
  const iconSize = type === 'Caption' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller
  const selectedColor = color ?? theme.colors.primary
  return (
    <StyledTouchableOpacity
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}>
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
        <StyledText
          type={type}
          color={selectedColor}
          onPress={onPress as AppButtonEventNative}
          onLongPress={onLongPress as AppButtonEventNative}>
          {wording}
        </StyledText>
      </Container>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  margin: -getSpacing(1 / 3), // Hack for reset default TouchableOpacity margin horizontal
})

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
