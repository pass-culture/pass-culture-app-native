import React, { ComponentType, Fragment, FunctionComponent, memo } from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  TextProps,
} from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'

export interface BaseButtonProps {
  accessibilityLabel?: string
  accessibilityDescribedBy?: string
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'small' | 'tall'
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  loadingIndicator?: ComponentType<IconInterface>
  inline?: boolean
  isLoading?: boolean
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
  testId?: string
  textSize?: number
  wording: string
  mediumWidth?: boolean
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  style?: StyleProp<ViewStyle>
  center?: boolean
  type?: 'button' | 'submit' | 'reset'
  name?: string
}

interface AppButtonProps extends BaseButtonProps {
  inline?: boolean
  inlineHeight?: number | string
  title?: ComponentType<TextProps>
  className?: string
}

type Only<TestedType, StandardType> = TestedType &
  Record<Exclude<keyof TestedType, keyof StandardType>, never>

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
  testId,
  wording,
  adjustsFontSizeToFit,
  justifyContent,
  numberOfLines,
  style,
  loadingIndicator: LoadingIndicator,
  center,
}: Only<T, AppButtonProps>) => {
  const pressHandler = disabled || isLoading ? undefined : onPress
  const longPressHandler = disabled || isLoading ? undefined : onLongPress
  return (
    <StyledTouchableOpacity
      {...accessibilityAndTestId(accessibilityLabel || wording, testId || wording)}
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
      style={style}
      center={center}>
      {!!LoadingIndicator && isLoading ? (
        <LoadingIndicator {...accessibilityAndTestId(undefined, 'button-isloading-icon')} />
      ) : (
        <Fragment>
          {!!Icon && <Icon {...accessibilityAndTestId(undefined, 'button-icon')} />}
          {!!Title && (
            <Title
              adjustsFontSizeToFit={adjustsFontSizeToFit ?? false}
              numberOfLines={numberOfLines ?? 1}>
              {wording}
            </Title>
          )}
        </Fragment>
      )}
    </StyledTouchableOpacity>
  )
}

const DefaultLoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.smaller,
}))``

_AppButton.defaultProps = {
  loadingIndicator: DefaultLoadingIndicator,
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

interface StyledTouchableOpacityProps {
  buttonHeight: 'small' | 'tall'
  inline?: boolean
  inlineHeight?: number | string
  mediumWidth?: boolean
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  center?: boolean
}

const StyledTouchableOpacity = styled(TouchableOpacity).attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<StyledTouchableOpacityProps>(
  ({
    theme,
    inline,
    buttonHeight,
    inlineHeight,
    mediumWidth,
    fullWidth,
    justifyContent,
    numberOfLines,
    center,
  }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: justifyContent ?? 'center',
    borderRadius: theme.borderRadius.button,
    padding: 2,
    height:
      buttonHeight === 'tall'
        ? theme.buttons.buttonHeights.tall
        : theme.buttons.buttonHeights.small,
    width: '100%',
    ...(center ? { alignSelf: 'center' } : {}),
    ...(fullWidth ? {} : { maxWidth: theme.contentPage.maxWidth }),
    ...(mediumWidth ? { maxWidth: theme.contentPage.mediumWidth } : {}),
    ...(inline
      ? {
          borderWidth: 0,
          borderRadius: 0,
          marginTop: 0,
          padding: 0,
          width: 'auto',
          height: inlineHeight ?? theme.buttons.buttonHeights.inline,
        }
      : {}),
    ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
    ...(numberOfLines ? { height: 'auto' } : {}),
  })
)
