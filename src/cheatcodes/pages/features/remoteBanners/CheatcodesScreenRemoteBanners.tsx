import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import { remoteBannerSchema } from 'features/remoteBanners/utils/remoteBannerSchema'
import { TechnicalProblemBanner } from 'features/technicalProblemBanner/components/TechnicalProblemBanner'
import { technicalProblemBannerSchema } from 'features/technicalProblemBanner/utils/technicalProblemBannerSchema'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Typo, getSpacing } from 'ui/theme'

export const CheatcodesScreenRemoteBanners = () => {
  const { options: showGenericBannerOptions } = useFeatureFlagOptionsQuery(
    RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER
  )
  const { options: disableActivationOptions } = useFeatureFlagOptionsQuery(
    RemoteStoreFeatureFlags.DISABLE_ACTIVATION
  )
  const { options: technicalProblemBannerOptions } = useFeatureFlagOptionsQuery(
    RemoteStoreFeatureFlags.SHOW_TECHNICAL_PROBLEM_BANNER
  )
  const [genericBannerError, setGenericBannerError] = useState('')
  const [activationBannerError, setActivationBannerError] = useState('')
  const [technicalProblemBannerError, setTechnicalProblemBannerError] = useState('')

  useEffect(() => {
    setGenericBannerError('')
    try {
      remoteBannerSchema.validateSync(showGenericBannerOptions)
    } catch (error) {
      setGenericBannerError(String(error))
    }
  }, [showGenericBannerOptions])

  useEffect(() => {
    setActivationBannerError('')
    try {
      remoteBannerSchema.validateSync(disableActivationOptions)
    } catch (error) {
      setActivationBannerError(String(error))
    }
  }, [disableActivationOptions])

  useEffect(() => {
    setTechnicalProblemBannerError('')
    try {
      technicalProblemBannerSchema.validateSync(technicalProblemBannerOptions)
    } catch (error) {
      setTechnicalProblemBannerError(String(error))
    }
  }, [technicalProblemBannerOptions])

  return (
    <CheatcodesTemplateScreen title="RemoteBanners 🆒" flexDirection="column">
      <ViewGap gap={3}>
        <Typo.Title3>RemoteGenericBanner</Typo.Title3>
        {showGenericBannerOptions ? (
          <RemoteGenericBanner
            from="cheatcodes"
            remoteGenericBannerOptions={showGenericBannerOptions}
          />
        ) : null}
        {genericBannerError ? (
          <Banner
            type={BannerType.ERROR}
            label={`La bannière RemoteGenericBanner ne s‘affichera pas à cause de l’erreur suivante:\n${genericBannerError}`}
          />
        ) : null}

        <StyledSeparator />

        <Typo.Title3>RemoteActivationBanner</Typo.Title3>
        {disableActivationOptions ? (
          <RemoteActivationBanner
            from="cheatcodes"
            remoteActivationBannerOptions={disableActivationOptions}
          />
        ) : null}
        {activationBannerError ? (
          <Banner
            type={BannerType.ERROR}
            label={`La bannière RemoteActivationBanner ne s'affichera pas à cause de l'erreur suivante\u00a0:\n${activationBannerError}`}
          />
        ) : null}

        <StyledSeparator />

        <Typo.Title3>TechnicalProblemBanner</Typo.Title3>
        {technicalProblemBannerOptions ? (
          <TechnicalProblemBanner options={technicalProblemBannerOptions} />
        ) : null}
        {technicalProblemBannerError ? (
          <Banner
            type={BannerType.ERROR}
            label={`La bannière TechnicalProblemBanner ne s'affichera pas à cause de l'erreur suivante\u00a0:\n${technicalProblemBannerError}`}
          />
        ) : null}
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
