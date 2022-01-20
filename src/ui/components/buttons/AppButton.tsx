import React, { Fragment, FunctionComponent, memo } from 'react'
import { GestureResponderEvent, StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export interface BaseButtonProps {
  accessibilityLabel?: string
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'small' | 'tall'
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  loadingIndicator?: FunctionComponent<IconInterface>
  inline?: boolean
  isLoading?: boolean
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
  testId?: string
  textSize?: number
  wording: string
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  style?: StyleProp<ViewStyle>
}

interface AppButtonProps extends BaseButtonProps {
  inline?: boolean
  inlineHeight?: number
  title: FunctionComponent<any>
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
  fullWidth,
  buttonHeight,
  inlineHeight,
  accessibilityLabel,
  testId,
  wording,
  adjustsFontSizeToFit,
  justifyContent,
  numberOfLines,
  style,
  loadingIndicator: LoadingIndicator,
}: Only<T, AppButtonProps>) => {
  const pressHandler = disabled || isLoading ? undefined : onPress
  const longPressHandler = disabled || isLoading ? undefined : onLongPress
  return (
    <StyledTouchableOpacity
      {...accessibilityAndTestId(accessibilityLabel || wording, testId || wording)}
      fullWidth={fullWidth}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={buttonHeight ?? 'small'}
      inline={inline}
      inlineHeight={inlineHeight ?? 16}
      justifyContent={justifyContent ?? 'center'}
      numberOfLines={numberOfLines}
      style={style}>
      {isLoading ? (
        // @ts-ignore check typing
        <LoadingIndicator {...accessibilityAndTestId(undefined, 'button-isloading-icon')} />
      ) : (
        <Fragment>
          {!!Icon && <Icon {...accessibilityAndTestId(undefined, 'button-icon')} />}
          {/* @ts-ignore fix typing */}
          <Title
            adjustsFontSizeToFit={adjustsFontSizeToFit ?? false}
            icon={Icon}
            numberOfLines={numberOfLines ?? 1}>
            {wording}
          </Title>
        </Fragment>
      )}
    </StyledTouchableOpacity>
  )
}

const DefaultLoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.icon.color,
  size: theme.icon.size,
}))``

// TODO: remove export when unecessary props are removed
export interface TitleProps {
  icon?: React.FC<IconInterface>
}

_AppButton.defaultProps = {
  loadingIndicator: DefaultLoadingIndicator,
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

interface StyledTouchableOpacityProps {
  buttonHeight: 'small' | 'tall'
  inline?: boolean
  inlineHeight?: number
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
}

const StyledTouchableOpacity = styled(TouchableOpacity).attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<StyledTouchableOpacityProps>(
  ({ theme, inline, buttonHeight, inlineHeight, fullWidth, justifyContent, numberOfLines }) => ({
    flexDirection: 'row',
    justifyContent: justifyContent === 'flex-start' ? 'flex-start' : 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.button,
    padding: 2,
    height: buttonHeight === 'tall' ? getSpacing(12) : getSpacing(10),
    width: '100%',
    ...(fullWidth ? {} : { maxWidth: getSpacing(125) }),
    ...(inline
      ? {
          borderWidth: 0,
          borderRadius: 0,
          marginTop: 0,
          padding: 0,
          width: 'auto',
          height: inlineHeight,
        }
      : {}),
    ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
    ...(numberOfLines ? { height: 'auto' } : {}),
  })
)
