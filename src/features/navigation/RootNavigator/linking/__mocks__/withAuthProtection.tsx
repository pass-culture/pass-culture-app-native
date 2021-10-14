import React, { ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuthProtection(WrappedComponent: ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function ComponentWithAuthProtection(props: any) {
    return <WrappedComponent {...props} />
  }
}
