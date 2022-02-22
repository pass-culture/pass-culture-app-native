import React, { ReactNode } from 'react'

export type LiProps = {
  children: ReactNode
  className?: string
}

export function Li(props: LiProps) {
  return <React.Fragment>{props.children}</React.Fragment>
}
