import React, { memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useGetFontScale } from 'shared/accessibility/useGetFontScale'
import { AppButtonInner } from 'ui/components/buttons/AppButton/AppButtonInner'
import { DefaultLoadingIndicator } from 'ui/components/buttons/AppButton/DefaultLoadingIndicator'
import { appButtonStyles } from 'ui/components/buttons/AppButton/styleUtils'
import {
  AppButtonEventNative,
  AppButtonProps,
  OnlyBaseButtonProps,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

const _AppButton = <T extends AppButtonProps>({
  icon: Icon,
  iconPosition = 'left',
  title: Title,
  inline,
  disabled,
  isLoading,
  onPress,
  onLongPress,
  mediumWidth,
  fullWidth,
  buttonHeight = 'small',
  inlineHeight,
  accessibilityLabel,
  accessibilityHint,
  wording,
  adjustsFontSizeToFit,
  justifyContent,
  numberOfLines,
  style,
  loadingIndicator: LoadingIndicator = DefaultLoadingIndicator,
  center,
  ellipsizeMode,
  backgroundColor,
}: OnlyBaseButtonProps<T>) => {
  const { fontScale } = useGetFontScale()
  const numberOfLinesComparedToFontScale = fontScale > 1 ? 2 : 1

  const pressHandler: AppButtonEventNative =
    disabled || isLoading ? undefined : (onPress as AppButtonEventNative)

  const longPressHandler: AppButtonEventNative =
    disabled || isLoading ? undefined : (onLongPress as AppButtonEventNative)

  return (
    <TouchableOpacityButton
      accessibilityLabel={accessibilityLabel || wording}
      accessibilityHint={accessibilityHint}
      mediumWidth={mediumWidth}
      fullWidth={fullWidth}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={buttonHeight}
      inline={inline}
      inlineHeight={inlineHeight}
      justifyContent={justifyContent}
      numberOfLines={numberOfLines ?? numberOfLinesComparedToFontScale}
      style={style as StyleProp<ViewStyle>}
      center={center}
      backgroundColor={backgroundColor}
      disabled={disabled}>
      <AppButtonInner
        loadingIndicator={LoadingIndicator}
        isLoading={isLoading}
        icon={Icon}
        iconPosition={iconPosition}
        title={Title}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        numberOfLines={numberOfLines ?? numberOfLinesComparedToFontScale}
        wording={wording}
        ellipsizeMode={ellipsizeMode}
      />
    </TouchableOpacityButton>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

const TouchableOpacityButton =
  styled(TouchableOpacity)<TouchableOpacityButtonProps>(appButtonStyles)
