import React from 'react'

import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Code } from 'ui/svg/icons/Code'

type PendingBonificationBannerProps = { amount: string; onClose: () => void }

export const PendingBonificationBanner = ({ amount, onClose }: PendingBonificationBannerProps) => (
  <Banner
    type={BannerType.ALERT}
    label={`Bonus de ${amount}`}
    description="Ton dossier est actuellement en cours de vérification."
    links={[]}
    Icon={Code}
    onClose={onClose}
  />
)
