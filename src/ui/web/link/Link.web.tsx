/**
 * Ce fichier est copier de @react-navigation/native et rajoute un hack nécessaire pour react-native-web,
 * En effet, nous n'avons pas trouvé comment annuler l'événement qui reload la page au click sur l'anchor tag en ReactJS,
 * Nous attachons donc un événement en vanillaJS pour annuler l'événement pour le Web
 *
 * Related issues :
 * - https://github.com/react-navigation/react-navigation/issues/10295
 * - https://github.com/necolas/react-native-web/issues/2206
 */
import { useLinkProps } from '@react-navigation/native'
import React, { createRef, useEffect } from 'react'
import { GestureResponderEvent, Platform, Text } from 'react-native'

import { Props } from './types'

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.to Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export function Link<ParamList extends ReactNavigation.RootParamList>({
  to,
  action,
  ...rest
}: Props<ParamList>) {
  const props = useLinkProps<ParamList>({ to, action })
  // ref ci-dessous pour le hack en VanillaJS
  const linkRef = createRef<HTMLAnchorElement>()

  function preventDefault(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
    onPress(event)
  }

  // useEffect ci-dessous pour le hack en VanillaJS
  useEffect(() => {
    // @ts-ignore en vanilla JS, le mouse click est un MouseEvent, pour rester consistant avec la fonction ci-dessous, nous ignorons ici et conservons le typing react
    linkRef.current?.addEventListener('click', preventDefault, true)

    return () => {
      // @ts-ignore en vanilla JS, le mouse click est un MouseEvent, pour rester consistant avec la fonction ci-dessous, nous ignorons ici et conservons le typing react
      linkRef.current?.removeEventListener('click', preventDefault)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => {
    // useful only for a11y, we do not want to navigate here
  }

  return React.createElement(Text, {
    // Ligne du dessous pour le hack en VanillaJS
    ref: linkRef,
    ...props,
    ...rest,
    ...Platform.select({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      web: { onClick: onPress } as any,
      default: { onPress },
    }),
  })
}
