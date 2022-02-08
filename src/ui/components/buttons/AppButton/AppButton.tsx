import React, { memo } from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AppButtonInner } from 'ui/components/buttons/AppButton/AppButtonInner'
import { DefaultLoadingIndicator } from 'ui/components/buttons/AppButton/DefaultLoadingIndicator'
import { appButtonStyles } from 'ui/components/buttons/AppButton/styleUtils'
import {
  AppButtonEventNative,
  AppButtonProps,
  OnlyBaseButtonProps,
  TouchableOpacityButtonProps,
} from 'ui/components/buttons/AppButton/types'

const _AppButton = <T extends AppButtonProps>({
  icon: Icon,
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
  accessibilityDescribedBy,
  testID,
  wording,
  adjustsFontSizeToFit,
  justifyContent,
  numberOfLines,
  style,
  loadingIndicator: LoadingIndicator,
  center,
}: OnlyBaseButtonProps<T>) => {
  const pressHandler: AppButtonEventNative =
    disabled || isLoading ? undefined : (onPress as AppButtonEventNative)
  const longPressHandler: AppButtonEventNative =
    disabled || isLoading ? undefined : (onLongPress as AppButtonEventNative)
  return (
    <TouchableOpacityButton
      {...accessibilityAndTestId(accessibilityLabel || wording, testID || wording)}
      aria-describedby={accessibilityDescribedBy}
      mediumWidth={mediumWidth}
      fullWidth={fullWidth}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={buttonHeight}
      inline={inline}
      inlineHeight={inlineHeight}
      justifyContent={justifyContent}
      numberOfLines={numberOfLines}
      style={style as StyleProp<ViewStyle>}
      center={center}>
      <AppButtonInner
        loadingIndicator={LoadingIndicator}
        isLoading={isLoading}
        icon={Icon}
        title={Title}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        numberOfLines={numberOfLines}
        wording={wording}
      />
    </TouchableOpacityButton>
  )
}

_AppButton.defaultProps = {
  loadingIndicator: DefaultLoadingIndicator,
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

const TouchableOpacityButton = styled(TouchableOpacity).attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<TouchableOpacityButtonProps>(appButtonStyles)
