import React, { ComponentType } from 'react'

import { useColorScheme } from 'libs/styled/useColorScheme'

export const withRemountOnColorSchemeHOC = <Props extends object>(
  WrappedComponent: ComponentType<Props>
): ComponentType<Props> => {
  const ComponentKeyedByColorScheme = (props: Props) => {
    const colorScheme = useColorScheme()
    return <WrappedComponent key={colorScheme} {...props} />
  }

  ComponentKeyedByColorScheme.displayName = `withRemountOnColorSchemeHOC(${WrappedComponent.name})`

  return ComponentKeyedByColorScheme
}
