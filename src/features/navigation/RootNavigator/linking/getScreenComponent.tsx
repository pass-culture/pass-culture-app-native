import React, { ComponentType } from 'react'

import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { OnboardingStackRoute } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { ProfileStackRoute } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { withScreenWrapper } from 'features/navigation/RootNavigator/withScreenWrapper'
import { SearchStackRoute } from 'features/navigation/SearchStackNavigator/types'
import { TabRoute } from 'features/navigation/TabBar/types'

import { RootRoute } from '../types'

import { withAuthProtection } from './withAuthProtection'

export function getScreenComponent(
  name: string,
  route: RootRoute | TabRoute | SearchStackRoute | ProfileStackRoute | OnboardingStackRoute,
  ScreenComponent: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): React.JSX.Element {
  let component = route.component
  component = route.hoc ? route.hoc(component) : withAsyncErrorBoundary(component)
  if (route.secure) component = withAuthProtection(component)
  component = withScreenWrapper(component, name)
  return <ScreenComponent key={name} name={name} component={component} options={route.options} />
}
