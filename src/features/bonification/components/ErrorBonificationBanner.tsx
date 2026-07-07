import React from 'react'

import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { Banner } from 'ui/designSystem/Banner/Banner'
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
  const links = [
    {
      wording: 'Voir plus de détails',
      navigateTo: getSubscriptionPropConfig('BonificationFamilyQuotientRefused', {
        bonificationRefusedType: refusedType,
      }),
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
