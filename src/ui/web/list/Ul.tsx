import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export default function Ul(props: Props) {
  return <React.Fragment>{props.children}</React.Fragment>
}

export { Ul, Ul as VerticalUl }
