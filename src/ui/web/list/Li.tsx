import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Li(props: Props) {
  return <React.Fragment>{props.children}</React.Fragment>
}
