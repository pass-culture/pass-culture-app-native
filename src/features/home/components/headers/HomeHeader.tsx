import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { ScreenOrigin } from 'features/location/enums'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const HomeHeader: FunctionComponent = function () {
  const availableCredit = useAvailableCredit()
  const { isLoggedIn, user } = useAuthContext()
  const { permissionState } = useLocation()
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
            from={StepperOrigin.HOME}
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
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={ArrowAgain}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner, enableAppLocation])

  const shouldDisplayMobileLocationWidget = !isDesktopViewport && enableAppLocation

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <TitleContainer>
          <Typo.Title1 numberOfLines={2}>{welcomeTitle}</Typo.Title1>
          <Subtitle>{getSubtitle()}</Subtitle>
        </TitleContainer>
        {!!shouldDisplayMobileLocationWidget && <LocationWidget screenOrigin={ScreenOrigin.HOME} />}
      </HeaderContainer>
      <PageContent>
        <Spacer.Column numberOfSpaces={6} />
        {Banner}
      </PageContent>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  zIndex: theme.zIndex.header,
}))

const TitleContainer = styled.View({
  width: '100%',
})
const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
