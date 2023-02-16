import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useMemo } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBeneficiaryValidationNavigation } from 'features/auth/helpers/useBeneficiaryValidationNavigation'
import { GeolocationBanner } from 'features/home/components/GeolocationBanner'
import { SignupBanner } from 'features/home/components/SignupBanner'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { env } from 'libs/environment'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { theme } from 'theme'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const HomeHeader: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const availableCredit = useAvailableCredit()
  const { top } = useCustomSafeInsets()
  const { isLoggedIn, user } = useAuthContext()
  const { permissionState } = useGeolocation()
  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation()
  const { data: subscription } = useNextSubscriptionStep()

  const shouldDisplayGeolocationBloc = permissionState !== GeolocPermissionState.GRANTED
  const shouldDisplaySubscriptionBloc =
    subscription?.nextSubscriptionStep && !!nextBeneficiaryValidationStepNavConfig

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

  const credit = useGetDepositAmountsByAge(user?.birthDate)

  const SystemBloc = useMemo(() => {
    if (!isLoggedIn) {
      return <SignupBanner />
    }

    if (shouldDisplaySubscriptionBloc) {
      return (
        <React.Fragment>
          <BannerWithBackground
            leftIcon={StyledBicolorUnlock}
            navigateTo={nextBeneficiaryValidationStepNavConfig}>
            <StyledButtonText>Débloque tes {credit}</StyledButtonText>
            <StyledBodyText>à dépenser sur l’application</StyledBodyText>
          </BannerWithBackground>
          <Spacer.Column numberOfSpaces={8} />
        </React.Fragment>
      )
    }
    if (shouldDisplayGeolocationBloc) {
      return (
        <React.Fragment>
          <GeolocationBanner />
          <Spacer.Column numberOfSpaces={8} />
        </React.Fragment>
      )
    }

    return null
  }, [
    shouldDisplaySubscriptionBloc,
    nextBeneficiaryValidationStepNavConfig,
    shouldDisplayGeolocationBloc,
    credit,
  ])

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
        {SystemBloc}
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

const StyledButtonText = styled(Typo.ButtonText)({
  color: theme.colors.white,
})

const StyledBodyText = styled(Typo.Body)({
  color: theme.colors.white,
})

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.white,
  color2: theme.colors.white,
}))``
