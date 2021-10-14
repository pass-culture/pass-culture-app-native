import React from 'react'
import { ComponentType } from 'react'

import { TabRoute } from 'features/navigation/TabBar/types'

import { Route } from '../types'

import { withAuthProtection } from './withAuthProtection'

export function getScreenComponent(
  name: string,
  route: Route | TabRoute,
  ScreenComponent: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): JSX.Element {
  const component = route.hoc ? route.hoc(route.component) : route.component
  const secureComponent = withAuthProtection(component, !!route.secure)
  return (
    <ScreenComponent key={name} name={name} component={secureComponent} options={route.options} />
  )
}
