import { useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CreditHeader } from 'features/profile/components/Header/CreditHeader/CreditHeader'
import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { env } from 'libs/environment'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type ProfileHeaderProps = {
  user?: UserProfileResponse
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const { user } = props
  const { isLoggedIn } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { top } = useCustomSafeInsets()

  const ProfileHeader = useMemo(() => {
    if (!isLoggedIn || !user) {
      return <LoggedOutHeader />
    }

    if (!user.isBeneficiary || user.isEligibleForBeneficiaryUpgrade) {
      return (
        <NonBeneficiaryHeader
          eligibilityStartDatetime={user.eligibilityStartDatetime?.toString()}
          eligibilityEndDatetime={user.eligibilityEndDatetime?.toString()}
        />
      )
    }

    return (
      <CreditHeader
        firstName={user.firstName}
        lastName={user.lastName}
        domainsCredit={user.domainsCredit}
        depositExpirationDate={user.depositExpirationDate ?? undefined}
      />
    )
  }, [isLoggedIn, user])

  return (
    <React.Fragment>
      {!!env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && (
        <CheatCodeButtonContainer
          onPress={() => navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
          style={{ top: getSpacing(3) + top }}>
          <Typo.Body>CheatMenu</Typo.Body>
        </CheatCodeButtonContainer>
      )}
      {ProfileHeader}
    </React.Fragment>
  )
}

const CheatCodeButtonContainer = styled(TouchableOpacity)(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(2),
  zIndex: theme.zIndex.cheatCodeButton,
  border: 1,
  padding: getSpacing(1),
}))
