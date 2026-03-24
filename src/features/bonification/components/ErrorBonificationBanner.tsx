import React from 'react'

import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

type ErrorBonificationBannerProps = {
  amount: string
  onClose: () => void
  refusedType: BonificationRefusedType
}

export const ErrorBonificationBanner = ({
  amount,
  refusedType,
  onClose,
}: ErrorBonificationBannerProps) => {
  const links = [
    {
      navigateTo: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: refusedType,
      }),
      wording: 'Voir plus de détails',
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
