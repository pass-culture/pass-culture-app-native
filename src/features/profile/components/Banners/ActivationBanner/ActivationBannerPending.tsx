import React from 'react'

import { Banner } from 'ui/designSystem/Banner/Banner'
import { Clock } from 'ui/svg/icons/Clock'

export const ActivationBannerPending = () => (
  <Banner
    testID="activation-banner-pending"
    Icon={Clock}
    label="Ton inscription est en cours de traitement."
  />
)
