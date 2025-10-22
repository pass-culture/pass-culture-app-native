
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react'

import { GenericHomeLegacy } from './GenericHomeLegacy'

type GenericHomeProps = {
  // ... props
}

export const GenericHome: FunctionComponent<GenericHomeProps> = (props) => {
  // Appelle directement le composant legacy
  return <GenericHomeLegacy {...props} />
}
