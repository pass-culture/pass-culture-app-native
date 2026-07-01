import React from 'react'

import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

type ErrorBonificationBannerProps = {
  amount: string
  onClose: () => void
  refusedType: BonificationRefusedType
  disableQFBonificationButton: boolean
}

export const ErrorBonificationBanner = ({
  amount,
  refusedType,
  onClose,
  disableQFBonificationButton,
}: ErrorBonificationBannerProps) => {
  const links = disableQFBonificationButton
    ? undefined
    : [
        {
          wording: 'Voir plus de détails',
          navigateTo: getSubscriptionPropConfig('BonificationRefused', {
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
