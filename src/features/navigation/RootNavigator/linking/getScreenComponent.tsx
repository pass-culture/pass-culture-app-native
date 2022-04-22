import React, { ComponentType } from 'react'

import { Route } from '../types'

export function getScreenComponent(
  name: string,
  route: Route,
  ScreenComponent: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): JSX.Element {
  let component = route.component
  component = route.hoc ? route.hoc(component) : component
  return <ScreenComponent key={name} name={name} component={component} options={route.options} />
}
