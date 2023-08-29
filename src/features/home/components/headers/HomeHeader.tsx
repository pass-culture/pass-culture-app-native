import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing, Spacer } from 'ui/theme'

export const HomeHeader: FunctionComponent = function () {
  const availableCredit = useAvailableCredit()
  const { isLoggedIn, user } = useAuthContext()
  const { permissionState } = useGeolocation()
  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useHomeBanner(isGeolocated)
  const homeBanner = data?.banner
  const { isDesktopViewport } = useTheme()
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)

  const welcomeTitle =
    user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Bienvenue\u00a0!'

  // we distinguish three different cases:
  // - not connected OR eligible-to-credit users
  // - beneficiary users
  // - ex-beneficiary users
  const getSubtitle = () => {
    const shouldSeeDefaultSubtitle =
      !isLoggedIn || !user || !isUserBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade
    if (shouldSeeDefaultSubtitle) return 'Toute la culture à portée de main'

    const shouldSeeBeneficiarySubtitle =
      isUserBeneficiary(user) && !!availableCredit && !availableCredit.isExpired
    if (shouldSeeBeneficiarySubtitle) {
      const credit = formatToFrenchDecimal(availableCredit.amount)
      return `Tu as ${credit} sur ton pass`
    }
    return 'Ton crédit est expiré'
  }

  const Banner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.activation_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BicolorUnlock}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.geolocation_banner && !enableAppLocation)
      return (
        <BannerContainer>
          <GeolocationBanner title={homeBanner.title} subtitle={homeBanner.text} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <ActivationBanner title={homeBanner.title} subtitle={homeBanner.text} icon={ArrowAgain} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner, enableAppLocation])

  const shouldDisplayLocationWidget = !isDesktopViewport && enableAppLocation

  return (
    <React.Fragment>
      <PageHeader title={welcomeTitle} subtitle={getSubtitle()} numberOfLines={2}>
        {shouldDisplayLocationWidget ? <LocationWidget /> : null}
      </PageHeader>
      <PageContent>
        <Spacer.Column numberOfSpaces={6} />
        {Banner}
      </PageContent>
    </React.Fragment>
  )
}

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
