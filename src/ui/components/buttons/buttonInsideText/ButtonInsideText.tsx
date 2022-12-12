import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'

export function ButtonInsideText({
  wording,
  typography = 'ButtonText',
  onPress,
  onLongPress,
  icon: Icon,
  buttonColor,
  testID,
  accessibilityRole,
}: ButtonInsideTexteProps) {
  return (
    <View>
      <StyledTouchableOpacity
        onPress={onPress as AppButtonEventNative}
        onLongPress={onLongPress as AppButtonEventNative}
        accessibilityRole={accessibilityRole}
        testID={testID}>
        <ButtonInsideTextInner
          wording={wording}
          icon={Icon}
          color={buttonColor}
          typography={typography}
        />
      </StyledTouchableOpacity>
    </View>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  top: getSpacing(Platform.OS === 'ios' ? 0.7 : 1), // Hack for reset default TouchableOpacity margin vertical
})
