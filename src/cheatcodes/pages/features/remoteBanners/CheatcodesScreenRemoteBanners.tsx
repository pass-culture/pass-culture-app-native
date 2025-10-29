import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import { remoteBannerSchema } from 'features/remoteBanners/utils/remoteBannerSchema'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Typo, getSpacing } from 'ui/theme'

export const CheatcodesScreenRemoteBanners = () => {
  const { options: showGenericBannerOptions } = useFeatureFlagOptions(
    RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER
  )
  const { options: disableActivationOptions } = useFeatureFlagOptions(
    RemoteStoreFeatureFlags.DISABLE_ACTIVATION
  )
  const [genericBannerError, setGenericBannerError] = useState('')
  const [activationBannerError, setActivationBannerError] = useState('')

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
            label={`La bannière RemoteActivationBanner ne s‘affichera pas à cause de l’erreur suivante\u00a0:\n${activationBannerError}`}
          />
        ) : null}
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
