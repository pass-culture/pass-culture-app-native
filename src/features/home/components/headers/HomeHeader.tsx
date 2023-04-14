import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { RetryActivationBanner } from 'features/home/components/banners/RetryActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { env } from 'libs/environment'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const HomeHeader: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const availableCredit = useAvailableCredit()
  const { top } = useCustomSafeInsets()
  const { isLoggedIn, user } = useAuthContext()

  const { permissionState } = useGeolocation()
  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useHomeBanner(isGeolocated)
  const homeBanner = data?.banner

  const welcomeTitle = user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Coucou\u00a0!'

  // we distinguish three different cases:
  // - not connected OR eligible-to-credit users
  // - beneficiary users
  // - ex-beneficiary users
  const getSubtitle = () => {
    const shouldSeeDefaultSubtitle =
      !isLoggedIn || !user || !isUserBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade
    if (shouldSeeDefaultSubtitle)
      return 'Vive le uzbifbkzbfbzobf ojbnafljbq oqiobqn lknqf eoinz pass\u00a0!'

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
          <ActivationBanner title={homeBanner.title} subtitle={homeBanner.text} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.geolocation_banner)
      return (
        <BannerContainer>
          <GeolocationBanner title={homeBanner.title} subtitle={homeBanner.text} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <RetryActivationBanner title={homeBanner.title} subtitle={homeBanner.text} />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner])

  return (
    <React.Fragment>
      {!!env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && (
        <CheatCodeButtonContainer
          onPress={() => navigation.navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
          style={{ top: getSpacing(3) + top }}>
          <Typo.Body>CheatMenu</Typo.Body>
        </CheatCodeButtonContainer>
      )}
      <PageHeader title={welcomeTitle} numberOfLines={2} />
      <PageContent>
        <Typo.Body>{getSubtitle()}</Typo.Body>
        <Spacer.Column numberOfSpaces={6} />
        {Banner}
      </PageContent>
    </React.Fragment>
  )
}

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})

const CheatCodeButtonContainer = styled(TouchableOpacity)(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(2),
  zIndex: theme.zIndex.cheatCodeButton,
  border: 1,
  padding: getSpacing(1),
}))

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
