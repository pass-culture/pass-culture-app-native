import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Ul(props: Props) {
  return <React.Fragment>{props.children}</React.Fragment>
}
