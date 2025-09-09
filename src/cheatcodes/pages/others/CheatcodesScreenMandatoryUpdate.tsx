import React from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'

export const CheatcodesScreenMandatoryUpdate = () => {
  const { isLoggedIn, user } = useAuthContext()
  const { data } = useRemoteConfigQuery()
  const displayMandatoryUpdatePersonalData = data?.displayMandatoryUpdatePersonalData
  const enableMandatoryUpdatePersonalData = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_MANDATORY_UPDATE_PERSONAL_DATA
  )

  return (
    <CheatcodesTemplateScreen title="Campagne MAJ données 🔥" flexDirection="column">
      <Typo.Title3>User</Typo.Title3>
      <BoolText value={user} />

      <StyledSeparator />

      <Typo.Title3>isLoggedIn</Typo.Title3>
      <BoolText value={isLoggedIn} />

      <StyledSeparator />

      <Typo.Title3>hasProfileExpired</Typo.Title3>
      <BoolText value={user?.hasProfileExpired} />

      <StyledSeparator />

      <Typo.Title3>Feature flag</Typo.Title3>
      <Typo.BodyAccentXs>enableMandatoryUpdatePersonalData</Typo.BodyAccentXs>
      <BoolText value={enableMandatoryUpdatePersonalData} />

      <StyledSeparator />

      <Typo.Title3>Remote Config</Typo.Title3>
      <Typo.BodyAccentXs>displayMandatoryUpdatePersonalData</Typo.BodyAccentXs>
      <BoolText value={displayMandatoryUpdatePersonalData} />
    </CheatcodesTemplateScreen>
  )
}

const StyledBodySuccess = styled(Typo.Button)(({ theme }) => ({
  color: theme.designSystem.color.text.success,
}))

const StyledBodyError = styled(Typo.Button)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
}))

const BoolText = ({ value }: { value: unknown }) => {
  const isTrue = Boolean(value)
  return isTrue ? (
    <StyledBodySuccess>{'true'}</StyledBodySuccess>
  ) : (
    <StyledBodyError>{'false'}</StyledBodyError>
  )
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))
