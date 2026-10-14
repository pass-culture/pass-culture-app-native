import React, { FunctionComponent } from 'react'

import { useShouldDisplayGeneralPublicHome } from 'features/generalPublicHome/hooks/useShouldDisplayGeneralPublicHome'
import { GeneralPublicHome } from 'features/generalPublicHome/pages/GeneralPublicHome'
import { Home } from 'features/home/pages/Home'

export const HomeSwitch: FunctionComponent = () => {
  const shouldDisplayGeneralPublicHome = useShouldDisplayGeneralPublicHome()

  return shouldDisplayGeneralPublicHome ? <GeneralPublicHome /> : <Home />
}
