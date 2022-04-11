import { useLinkProps } from '@react-navigation/native'
import React, { createRef, ElementType, memo, useEffect, useState } from 'react'
import { GestureResponderEvent, NativeSyntheticEvent, Platform, TargetedEvent } from 'react-native'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'
import { TouchableLinkProps } from 'ui/web/link/types'

function _TouchableLink({
  onPress,
  to,
  externalHref,
  children,
  highlight = false,
  disabled,
  onFocus,
  onBlur,
  ...rest
}: TouchableLinkProps) {
  const TouchableComponent = (
    highlight ? StyledTouchableHighlight : StyledTouchableOpacity
  ) as ElementType
  const linkRef = createRef<HTMLAnchorElement>()
  const [isFocus, setIsFocus] = useState(false)

  const internalLinkProps = useLinkProps({ to: to ?? '' })
  const externalLinkProps = externalHref ? { href: externalHref, target: '_blank' } : {}
  const linkProps = to ? internalLinkProps : externalLinkProps
  const touchableOpacityProps =
    Platform.OS === 'web' && !disabled
      ? { ...linkProps, accessibilityRole: undefined }
      : { accessibilityRole: 'link' }

  function onClick(event: GestureResponderEvent) {
    Platform.OS === 'web' && event?.preventDefault()
    onPress && onPress(event)
  }

  function onLinkFocus(e: NativeSyntheticEvent<TargetedEvent>) {
    setIsFocus(true)
    onFocus && onFocus(e)
  }

  function onLinkBlur(e: NativeSyntheticEvent<TargetedEvent>) {
    setIsFocus(false)
    onBlur && onBlur(e)
  }

  // useEffect ci-dessous pour le hack en VanillaJS
  useEffect(() => {
    // @ts-ignore en vanilla JS, le mouse click est un MouseEvent, pour rester consistant avec la fonction ci-dessous, nous ignorons ici et conservons le typing react
    linkRef.current?.addEventListener('click', preventDefault, true)

    return () => {
      // @ts-ignore en vanilla JS, le mouse click est un MouseEvent, pour rester consistant avec la fonction ci-dessous, nous ignorons ici et conservons le typing react
      // eslint-disable-next-line react-hooks/exhaustive-deps
      linkRef.current?.removeEventListener('click', preventDefault)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TouchableComponent
      {...touchableOpacityProps}
      {...rest}
      disabled={disabled}
      isFocus={isFocus}
      onFocus={onLinkFocus}
      onBlur={onLinkBlur}
      onPress={disabled ? undefined : onClick}>
      {children}
    </TouchableComponent>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const TouchableLink = memo(_TouchableLink)

const StyledTouchableOpacity = styled(TouchableOpacity)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => touchableFocusOutline(theme, isFocus)
)

const StyledTouchableHighlight = styled.TouchableHighlight<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => touchableFocusOutline(theme, isFocus)
)
