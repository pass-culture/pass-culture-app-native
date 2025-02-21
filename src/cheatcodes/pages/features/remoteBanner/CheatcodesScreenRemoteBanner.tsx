import React, { useEffect, useState } from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import { remoteBannerSchema } from 'features/remoteBanner/components/remoteBannerSchema'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const CheatcodesScreenRemoteBanner = () => {
  const { options } = useFeatureFlagOptions(RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      remoteBannerSchema.validateSync(options)
    } catch (error) {
      setError(String(error))
    }
  }, [options])

  return (
    <CheatcodesTemplateScreen title="RemoteBanner 🆒" flexDirection="column">
      <ViewGap gap={3}>
        <RemoteBanner from="Cheatcodes" />
        {error ? (
          <ErrorBanner
            message={`La bannière ne s‘affichera pas à cause de l’erreur suivante:\n${error}`}
          />
        ) : null}
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}
