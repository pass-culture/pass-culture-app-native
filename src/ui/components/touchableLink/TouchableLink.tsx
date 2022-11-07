import { useLinkProps, useNavigation } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { createRef, ElementType, useEffect, useState } from 'react'
import { GestureResponderEvent, NativeSyntheticEvent, Platform, TargetedEvent } from 'react-native'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { pushFromRef, navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

const ON_PRESS_DEBOUNCE_DELAY = 300

export function TouchableLink({
  onBeforeNavigate,
  onAfterNavigate,
  enableNavigate = true,
  navigateTo,
  externalNav,
  children,
  highlight = false,
  disabled,
  onFocus,
  onBlur,
  as: Tag,
  isOnPressDebounced,
  hoverUnderlineColor,
  ...rest
}: TouchableLinkProps) {
  const TouchableComponent = (
    highlight ? StyledTouchableHighlight : StyledTouchableOpacity
  ) as ElementType
  const TouchableLinkComponent = Tag ? Tag : TouchableComponent
  const linkRef = createRef<HTMLAnchorElement>()
  const [isFocus, setIsFocus] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const { navigate, push } = useNavigation<UseNavigationType>()
  const { navigateTo: navigateToItinerary } = useItinerary()

  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const externalLinkProps = externalNav ? { href: externalNav.url, target: '_blank' } : {}
  const linkProps = navigateTo ? internalLinkProps : externalLinkProps
  const touchableOpacityProps =
    Platform.OS === 'web' && !disabled
      ? { ...linkProps, accessibilityRole: undefined }
      : { accessibilityRole: 'link' }

  const handleNavigation = () => {
    if (navigateTo && enableNavigate) {
      const { screen, params, fromRef, withPush } = navigateTo
      if (withPush) {
        fromRef ? pushFromRef(screen, params) : push(screen, params)
      } else {
        fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
      }
    } else if (externalNav) {
      const { url, params, address, onSuccess, onError } = externalNav
      if (address) {
        navigateToItinerary(address)
      } else {
        openUrl(url, params).then(onSuccess).catch(onError)
      }
    }
  }

  async function onClick(event: GestureResponderEvent) {
    Platform.OS === 'web' && event?.preventDefault()
    if (onBeforeNavigate) await onBeforeNavigate(event)
    if (enableNavigate) {
      handleNavigation()
    }
    if (onAfterNavigate) await onAfterNavigate(event)
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

  const callOnClick = isOnPressDebounced ? debounce(onClick, ON_PRESS_DEBOUNCE_DELAY) : onClick

  return (
    <TouchableLinkComponent
      {...touchableOpacityProps}
      {...rest}
      disabled={disabled}
      isFocus={isFocus}
      isHover={isHover}
      hoverUnderlineColor={hoverUnderlineColor}
      onFocus={onLinkFocus}
      onBlur={onLinkBlur}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onPress={disabled ? undefined : callOnClick}>
      {children}
    </TouchableLinkComponent>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  isFocus?: boolean
  isHover?: boolean
  hoverUnderlineColor?: TouchableLinkProps['hoverUnderlineColor']
}>(({ theme, isFocus, isHover, hoverUnderlineColor }) => ({
  ...touchableFocusOutline(theme, isFocus),
  ...getHoverStyle(hoverUnderlineColor ?? theme.colors.black, isHover),
}))

const StyledTouchableHighlight = styled.TouchableHighlight<{
  isFocus?: boolean
  isHover?: boolean
  hoverUnderlineColor?: TouchableLinkProps['hoverUnderlineColor']
}>(({ theme, isFocus, isHover, hoverUnderlineColor }) => ({
  textDecoration: 'none',
  ...touchableFocusOutline(theme, isFocus),
  ...getHoverStyle(hoverUnderlineColor ?? theme.colors.black, isHover),
}))
