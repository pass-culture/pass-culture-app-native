import { useLinkProps, useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'
import React, {
  ComponentProps,
  createRef,
  ElementType,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import { GestureResponderEvent, NativeSyntheticEvent, Platform, TargetedEvent } from 'react-native'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

export function TouchableLink<T extends ElementType = ElementType>({
  onPress,
  navigateTo,
  externalNav,
  navigateBeforeOnPress,
  children,
  highlight = false,
  disabled,
  onFocus,
  onBlur,
  as: Tag,
  useDebounce,
  ...rest
}: TouchableLinkProps<T> & ComponentProps<T>): ReactElement {
  const TouchableComponent = (
    highlight ? StyledTouchableHighlight : StyledTouchableOpacity
  ) as ElementType
  const TouchableLinkComponent = Tag ? Tag : TouchableComponent
  const linkRef = createRef<HTMLAnchorElement>()
  const [isFocus, setIsFocus] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const { navigateTo: navigateToItinerary } = useItinerary()

  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const externalLinkProps = externalNav ? { href: externalNav.url, target: '_blank' } : {}
  const linkProps = navigateTo ? internalLinkProps : externalLinkProps
  const touchableOpacityProps =
    Platform.OS === 'web' && !disabled
      ? { ...linkProps, accessibilityRole: undefined }
      : { accessibilityRole: 'link' }

  const handleNavigation = () => {
    if (navigateTo) {
      const { screen, params, fromRef } = navigateTo
      ;(fromRef ? navigateFromRef : navigate)(screen, params)
    } else if (externalNav) {
      const { url, params, address, onSuccess, onError } = externalNav
      if (address) {
        navigateToItinerary(address)
      } else {
        openUrl(url, params).then(onSuccess).catch(onError)
      }
    }
  }

  function onClick(event: GestureResponderEvent) {
    Platform.OS === 'web' && event?.preventDefault()
    if (navigateBeforeOnPress) {
      handleNavigation()
    }
    if (onPress) {
      onPress(event)
    }
    if (!navigateBeforeOnPress) {
      handleNavigation()
    }
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

  const callOnClick = useDebounce ? debounce(onClick, 300) : onClick

  return (
    <TouchableLinkComponent
      {...touchableOpacityProps}
      {...rest}
      disabled={disabled}
      isFocus={isFocus}
      onFocus={onLinkFocus}
      onBlur={onLinkBlur}
      onPress={disabled ? undefined : callOnClick}>
      {children}
    </TouchableLinkComponent>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => touchableFocusOutline(theme, isFocus)
)

const StyledTouchableHighlight = styled.TouchableHighlight<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => touchableFocusOutline(theme, isFocus)
)
