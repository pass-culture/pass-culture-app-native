import { useLinkProps } from '@react-navigation/native'
import React, { createRef, ElementType, memo, useEffect } from 'react'
import { GestureResponderEvent, TouchableHighlight, Platform } from 'react-native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { TouchableLinkProps } from 'ui/web/link/types'

function _TouchableLink({
  onPress,
  to,
  externalHref,
  children,
  highlight = false,
  ...rest
}: TouchableLinkProps) {
  const TouchableComponent = (highlight ? TouchableHighlight : TouchableOpacity) as ElementType
  const linkRef = createRef<HTMLAnchorElement>()

  const internalLinkProps = useLinkProps({ to: to ?? '' })
  const externalLinkProps = externalHref ? { href: externalHref, target: '_blank' } : {}
  const linkProps = to ? internalLinkProps : externalLinkProps
  const touchableOpacityProps =
    Platform.OS === 'web'
      ? { ...linkProps, accessibilityRole: undefined }
      : { accessibilityRole: 'link' }

  function onClick(event: GestureResponderEvent) {
    Platform.OS === 'web' && event?.preventDefault()
    onPress && onPress(event)
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
    <TouchableComponent {...touchableOpacityProps} {...rest} onPress={onClick}>
      {children}
    </TouchableComponent>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const TouchableLink = memo(_TouchableLink)
