import React, { Fragment } from 'react'

import { AllNavParamList } from 'features/navigation/RootNavigator'

import { Props } from './types'

export function Link({ children }: Props<AllNavParamList>) {
  return <Fragment>{children}</Fragment>
}
