import React from 'react'

import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Offers } from 'ui/svg/icons/Offers'

type Props = { homeId: CustomRemoteConfig['homeEntryIdFreeOffers'] }

export const FreeHomeButton = ({ homeId }: Props) => (
  <InternalTouchableLink
    as={Button}
    wording="Profite d’offres gratuites"
    navigateTo={{ screen: 'ThematicHome', params: { homeId, from: 'profile' } }}
    icon={Offers}
  />
)
