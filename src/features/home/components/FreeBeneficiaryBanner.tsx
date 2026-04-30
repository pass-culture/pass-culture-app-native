import React from 'react'

import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ProfileOrigin } from 'features/identityCheck/pages/profile/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Offers } from 'ui/svg/icons/Offers'

export const FreeBeneficiaryBanner = () => {
  const storedProfileInfos = useStoredProfileInfos()
  return (
    <SystemBanner
      leftIcon={Offers}
      title="Profite d’offres gratuites"
      subtitle="Complète ton profil pour y accéder."
      withBackground={false}
      analyticsParams={{
        type: 'freeBeneficiaryBanner',
        from: 'home',
      }}
      navigateTo={getSubscriptionPropConfig(
        storedProfileInfos ? 'ProfileInformationValidationCreate' : 'SetName',
        {
          type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
          origin: ProfileOrigin.HOME_BANNER,
        }
      )}
    />
  )
}
