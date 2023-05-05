import React, { ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any

export function withAuthProtection(WrappedComponent: ComponentType<Props>) {
  return function ComponentWithAuthProtection(props: Props) {
    return <WrappedComponent {...props} />
  }
}
