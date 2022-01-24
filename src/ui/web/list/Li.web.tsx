import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Li(props: Props) {
  return <li className={props.className}>{props.children}</li>
}
