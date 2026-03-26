import React from 'react'

import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { LogoFilled } from 'ui/svg/icons/LogoFilled'

type DefaultBonificationBannerProps = { amount: string; onClose: () => void }

export const DefaultBonificationBanner = ({ amount, onClose }: DefaultBonificationBannerProps) => {
  const links = [
    {
      navigateTo: getSubscriptionPropConfig('BonificationExplanations'),
      wording: 'Vérifier maintenant',
    },
  ]

  return (
    <Banner
      type={BannerType.DEFAULT}
      label={`Bonus de ${amount}`}
      description="Tu es peut-être éligible à ce bonus, vérifie si tu y as droit."
      links={links}
      Icon={LogoFilled}
      onClose={onClose}
    />
  )
}
