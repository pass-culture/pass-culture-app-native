import React from 'react'

import { Typo } from 'ui/theme'

// This should never render if everything is configured correctly
// This component was created temporarily to satisfy getScreensAndConfig
// Once the transition to lazy loading stacks is completed this component should be deleted
export const ComponentForPathConfig = () => {
  return <Typo.Body>Chargement...</Typo.Body>
}
