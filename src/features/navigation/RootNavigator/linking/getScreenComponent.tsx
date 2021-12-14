import React from 'react'
import { ComponentType } from 'react'

import { withAsyncErrorBoundary } from 'features/errors'
import { TabRoute } from 'features/navigation/TabBar/types'

import { Route } from '../types'

import { withAuthProtection } from './withAuthProtection'

export function getScreenComponent(
  name: string,
  route: Route | TabRoute,
  ScreenComponent: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): JSX.Element {
  let component = route.component
  component = route.hoc ? route.hoc(component) : withAsyncErrorBoundary(component)
  if (route.secure) component = withAuthProtection(component)
  return <ScreenComponent key={name} name={name} component={component} options={route.options} />
}
