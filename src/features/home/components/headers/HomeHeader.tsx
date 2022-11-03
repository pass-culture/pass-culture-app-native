import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { GeolocationBanner } from 'features/home/components/GeolocationBanner'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserBeneficiary } from 'features/profile/utils'
import { env } from 'libs/environment'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const HomeHeader: FunctionComponent = function () {
  const navigation = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()
  const availableCredit = useAvailableCredit()
  const { top } = useCustomSafeInsets()
  const { isLoggedIn } = useAuthContext()
  const { permissionState } = useGeolocation()
  const shouldDisplayGeolocationBloc = permissionState !== GeolocPermissionState.GRANTED

  const welcomeTitle =
    user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Bienvenue\u00a0!'

  // we distinguish three different cases:
  // - not connected OR eligible-to-credit users
  // - beneficiary users
  // - ex-beneficiary users
  const getSubtitle = () => {
    const shouldSeeDefaultSubtitle =
      !user || !isUserBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade
    if (shouldSeeDefaultSubtitle) return 'Toute la culture à portée de main'

    const shouldSeeBeneficiarySubtitle =
      isUserBeneficiary(user) && !!availableCredit && !availableCredit.isExpired
    if (shouldSeeBeneficiarySubtitle) {
      const credit = formatToFrenchDecimal(availableCredit.amount)
      return `Tu as ${credit} sur ton pass`
    }
    return 'Ton crédit est expiré'
  }

  return (
    <Container>
      {!!env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && (
        <CheatCodeButtonContainer
          onPress={() => navigation.navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
          style={{ top: getSpacing(3) + top }}>
          <Typo.Body>CheatMenu</Typo.Body>
        </CheatCodeButtonContainer>
      )}

      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={6} />
      <StyledTitle1>{welcomeTitle}</StyledTitle1>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body>{getSubtitle()}</Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      {shouldDisplayGeolocationBloc ? (
        <React.Fragment>
          <GeolocationBanner />
          <Spacer.Column numberOfSpaces={8} />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(6),
})

const StyledTitle1 = styled(Typo.Title1).attrs({
  numberOfLines: 2,
})({})

const CheatCodeButtonContainer = styled(TouchableOpacity)(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(2),
  zIndex: theme.zIndex.cheatCodeButton,
  border: 1,
  padding: getSpacing(1),
}))
