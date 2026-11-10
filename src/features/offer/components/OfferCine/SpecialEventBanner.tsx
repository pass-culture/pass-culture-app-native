import React from 'react'

import { env } from 'libs/environment/env'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'

export const SpecialEventBanner = () => {
  const links = [
    {
      externalNav: { url: env.FAQ_LINK_SPECIAL_EVENT },
      wording: 'Qu’est-ce qu’une séance spéciale\u00a0?',
    },
  ]

  return (
    <Banner
      type={BannerType.DEFAULT}
      label="Des séances spéciales sont disponibles pour ce film"
      links={links}
      Icon={InfoPlain}
    />
  )
}
