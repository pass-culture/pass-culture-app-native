import React, { FunctionComponent } from 'react'

import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Code } from 'ui/svg/icons/Code'

export const BonificationBanner: FunctionComponent = () => {
  // TODO(PC-38487): Use value from backend
  const onClose = () =>
    alert(
      'TODO(PC-38487): Récupérer la valeur depuis le backend pour permettre de cacher la bannière. Actuellement la bannière s’affiche en fonction de la valeur du feature flag "ENABLE_BONIFICATION".'
    )

  return (
    <Banner
      label="Une aide pourrait t’être attribuée, voyons ensemble si tu peux y être éligible"
      Icon={Code}
      links={[
        {
          navigateTo: getSubscriptionPropConfig('BonificationIntroduction'),
          wording: 'Je veux vérifier',
        },
      ]}
      onClose={onClose}
    />
  )
}
