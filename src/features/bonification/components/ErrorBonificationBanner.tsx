import React from 'react'

import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { BannerLink, Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

type ErrorBonificationBannerProps = {
  amount: string
  onClose: () => void
  refusedType: BonificationQFRefusedType
}

export const ErrorBonificationBanner = ({
  amount,
  refusedType,
  onClose,
}: ErrorBonificationBannerProps) => {
  const links: BannerLink[] = [
    {
      wording: 'Voir plus de détails',
      navigateTo: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: refusedType,
        },
      },
    },
  ]

  return (
    <Banner
      type={BannerType.ERROR}
      label={`Bonus de ${amount}`}
      description="Ton dossier a été refusé."
      links={links}
      Icon={WarningFilled}
      onClose={onClose}
    />
  )
}
