import React, { createRef, useEffect } from 'react'
import styled from 'styled-components'

import { AProps } from 'ui/web/link/types'

export function A({ children, accessible = false, ...props }: AProps) {
  const linkRef = createRef<HTMLAnchorElement>()

  function preventDefault(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
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

  return (
    <ControlledA ref={linkRef} {...props} tabIndex={accessible ? 0 : -1}>
      {children}
    </ControlledA>
  )
}

const ControlledA = styled.a.attrs({
  target: '_blank',
})({
  textDecoration: 'none',
})
